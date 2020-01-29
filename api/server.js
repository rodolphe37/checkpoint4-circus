const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connection = require('./connection');

const api = express();

// Support JSON-encoded & URL-encoded bodies
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));

// allows cross origin requests (localhost:xxxx)
// api.use(cors());
api.use(cors({ origin: '*' }));

connection.connect((err) => {
  if (err) throw err;
  console.log('connected to MYSQL database');
});

// all bookings
api.get('/api/bookings', (req, res) => {
  connection.query(
    `SELECT events.*, SUM(IFNULL(bookings.quantity_booking, 0)) as total_booking FROM bookings RIGHT JOIN events ON bookings.event_id=events.id_event GROUP BY events.id_event ORDER BY events.date_event ASC;`,
      (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

// bookings from today 00:00
api.get('/api/events/curdate', (req, res) => {
  connection.query(
    `SELECT events.*, SUM(IFNULL(bookings.quantity_booking, 0)) as total_booking FROM bookings RIGHT JOIN events ON bookings.event_id=events.id_event WHERE events.date_event >= CURDATE() GROUP BY events.id_event ORDER BY events.date_event ASC;`,
      (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

api.get('/api/booking/:id', (req, res) => {
  const idEvent = req.params.id
  connection.query(
    `SELECT events.*, SUM(IFNULL(bookings.quantity_booking, 0)) as total_booking FROM bookings RIGHT JOIN events ON bookings.event_id=events.id_event WHERE events.date_event >= CURDATE() AND events.id_event = ? GROUP BY events.id_event ORDER BY events.date_event ASC;`,
    [idEvent],
    (err, result)=>{
    if (err){
      res.status(500).send("error server")
    }else{
      res.send(result)
    }
  })
})

api.post('/api/events', (req, res) => {
  const formData = req.body;
  console.log(formData);

  const data = {
    date_event: `${formData.date} ${formData.hour}`,
    city_event: formData.city,
    address_event: formData.address,
    capacity: formData.capacity,
  }
  console.log(data);
  connection.query('INSERT INTO events SET ?', 
  data, 
  (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la sauvegarde d'un nouveau evenement");
    } else {
      res.status(200).send('evenement créé dans la base de données');
    }    
  });
});


api.delete('/api/event/:id', (req, res) => {
  const idEvent = req.params.id;
  console.log(`lancement suppression de l'evenement ${idEvent}: controle si l'evenement existe`);
  // controle si l'evenement existe
  connection.query(
    `SELECT COUNT(IFNULL(id_event, 0)) AS nb_event FROM events WHERE events.id_event = ? ;`,
    [idEvent], 
    (err, result) => {
      if (err) {
        console.log(`Erreur lors de l'appel a la base de données: ${err}`);
        res.status(500).send(`Erreur lors de l'appel a la base de données: ${err}`);
      };
      if (result[0].nb_event === 0) {
        console.log(`l'évènement n°${idEvent} n'existe pas.`);
        res.status(410).send(`l'évènement n°${idEvent} n'existe pas.`);
      } else {
        // controle si l'evenement contient des inscriptions
        console.log(`l'évènement n°${idEvent} existe: lancement du controle des réservations`);
        connection.query(
          `SELECT SUM(IFNULL(quantity_booking, 0)) as total_booking FROM bookings RIGHT JOIN events ON bookings.event_id=events.id_event WHERE events.id_event = ? GROUP BY events.id_event ;`,
          [idEvent], 
          (err, result) => {
          if (err) {
            console.log(`Erreur lors de l'appel a la base de données: ${err}`);
            res.status(500).send(`Erreur lors de l'appel a la base de données: ${err}`);
          };

          if (result[0].total_booking === 0) {
            // supprime l'evenement (si evenement existant et pas d'inscription)
            console.log(`le nb de résa = 0 : lancement de la suppression de l'evenement`);
            connection.query(
              'DELETE FROM events WHERE id_event = ?', 
            [idEvent], 
            (err, result) => {
              if (err) {
                console.log(`Erreur lors de la suppression d'un évènement: ${err}`);
                res.status(500).send(`Erreur lors de la suppression d'un évènement: ${err}`);
              } else {
                console.log(`l'évènement n°${idEvent} vient d'être supprimé (${result.affectedRows} affectedRows, ${result.warningCount} warnings)`);
                res.status(200).send(`l'évènement n°${idEvent} vient d'être supprimé (${result.affectedRows} affectedRows, ${result.warningCount} warnings)`)
              }
            });
          } else {
            console.log(`l'évènement n°${idEvent} contient des réservations. impossible de supprimer l'évènement`)
            res.status(304).send(`l'évènement n°${idEvent} contient des réservations. il faut supprimer les réservations concernées avant de pouvoir supprimer l'évènement`)
          };

        });
      }
    }
  );
});


api.listen(8000, 'localhost', (err) => {
  if (err) throw err;
  console.log('API is running on localhost:8000');
});
