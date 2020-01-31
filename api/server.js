require('dotenv').config();
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

api.get('/api/users', (req, res) => {
    connection.query('SELECT * FROM users WHERE anonym = 0', (err, result) => {
      const data = result.map((user, index) => ({
        idUser: user.id_user,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        birthday: moment(user.birthday).format('YYYY-MM-DD HH:mm:ss'),
        gender: user.gender,
        memberId: user.member_id,
        memberActive: user.member_active,
        membershipDateLast: moment(user.membership_date_last).format('YYYY-MM-DD HH:mm:ss'),
        membershipPlace: user.membership_place,
        adress: user.address_user,
        zip: user.zip,
        city: user.city,
        neighborhood: user.neighborhood,
        imageCopyright: user.image_copyright,
        mailingActive: user.mailing_active,
        anonym: user.anonym,
      }))
      if (err) throw err;
      res.json(data);
    });
  });

  api.delete('/api/booking/:id', (req, res) => {
  const idBooking = req.params.id;
  console.log(`lancement suppression de la réservation ${idBooking}: `);
  // controle si la réservation existe
  connection.query(`SELECT COUNT(id_booking) as nb_booking FROM bookings WHERE id_booking = ? `, [idBooking], (err, result) => {
    if (err) {
      console.log(`Erreur lors de l'appel a la base de données: ${err}`);
      res.status(500).send(`Erreur lors de l'appel a la base de données: ${err}`);
    };
    if (result[0].nb_booking === 0) {
      console.log(`la réservation n°${idBooking} n'existe pas.`);
      res.status(410).send(`la réservation n°${idBooking} n'existe pas.`);
    } else {
      // supprime la réservation 
      connection.query('DELETE FROM bookings WHERE id_booking = ?', [idBooking], (err, result) => {
        if (err) {
          console.log(`Erreur lors de la suppression d'un réservation: ${err}`);
          res.status(500).send(`Erreur lors de la suppression d'un réservation: ${err}`);
        } else {
          console.log(`la réservation n°${idBooking} vient d'être supprimé (${result.affectedRows} affectedRows, ${result.warningCount} warnings)`);
          res.status(200).send(`la réservation n°${idBooking} vient d'être supprimé (${result.affectedRows} affectedRows, ${result.warningCount} warnings)`);
        }
      });
    }
  });
});

api.post('/api/bookings/', (req, res) => {
    const reservation = req.body
    console.log(reservation)
    // console.log(reservation)
    { reservation.memberNumber ? reservation.memberNumber = `'${reservation.memberNumber}'` : reservation.memberNumber = null }
    { reservation.quantityAdult ? reservation.quantityAdult = parseInt(`${reservation.quantityAdult}`, 10) : reservation.quantityAdult = null }
    { reservation.quantityChildren ? reservation.quantityChildren = parseInt(`${reservation.quantityChildren}`, 10) : reservation.quantityChildren = null }
    //  console.log(reservation.quantityAdult)
    if (reservation.existantUser === false) {
      connection.query(`INSERT INTO users (firstname,lastname,email,phone,anonym,member_id) VALUES ("${reservation.firstname}","${reservation.lastname}","${reservation.email}","${reservation.phone}",false, ${reservation.memberNumber})`, reservation, (err, result) => {
        if (err) {
          console.log(err)
          res.status(500).send("error while saving")
        } else {
          connection.query(`SELECT id_user FROM users ORDER BY id_user DESC LIMIT 1`, (err, result) => {
            if (err) {
              console.log(err)

            } else {
              connection.query(`INSERT INTO registrations(quantity_adult , quantity_children, allergie,comment , user_id, event_id) VALUES(${reservation.quantityAdult},${reservation.quantityChildren},"${reservation.allergies}","${reservation.comment}",${result[0].id_user},${reservation.eventId})`,
                reservation, (err, result) => {
                  if (err) {
                    console.log(err)
                    res.status(500).send("error while saving")
                  } else {
                    res.sendStatus(200)
                  }
                });
            }
          })
        }
      })
    } else {
      connection.query(`INSERT INTO registrations(quantity_adult , quantity_children, allergie, comment, user_id, event_id) VALUES(${reservation.quantityAdult},${reservation.quantityChildren},"${reservation.allergies}","${reservation.comment}","${reservation.idUser}",${reservation.eventId})`,
        reservation, (err, result) => {

          if (err) {
            console.log(err)
            res.status(500).send("error while saving")
          } else {
            res.sendStatus(200)
          }
        });

    }
});

api.put('/api/bookings/:id', (req, res) => {
  const idRegistration = req.params.id
  const changeInfo = req.body
  {changeInfo.quantityAdult ? changeInfo.quantityAdult= parseInt(changeInfo.quantityAdult,10) : changeInfo.quantityAdult=null}
  {changeInfo.quantityChildren ? changeInfo.quantityChildren= parseInt(changeInfo.quantityChildren,10) : changeInfo.quantityChildren=null}
  if (idRegistration>0){
    connection.query(`UPDATE  registrations  SET  quantity_adult =${changeInfo.quantityAdult},quantity_children=${changeInfo.quantityChildren}, allergie="${changeInfo.allergies}", comment="${changeInfo.comment}", user_id=${changeInfo.idUser} WHERE id_registration= ${idRegistration}` , err=>{
      if (err){
        console.log(err)
        res.status(500).send("raté pov tanche")
      }else{
        res.sendStatus(200)
      }
    })  
  }
})

api.post('/api/reservation/public/', (req, res) => {
  const values = req.body;
  console.log(values)
  if (values.memberId) {
    connection.query(
      `SELECT id_user, email FROM users WHERE member_id=${values.memberId}`, (err, result) => {
        if (err) {
          console.log(err)
        } else if (result.length === 0) {
          connection.query(
            `INSERT INTO users (firstname, lastname, email, phone, anonym) VALUES('${values.firstname}', '${values.lastname}', '${values.email}', '${values.phone}', false)`,
            (err, result) => {
              if (err) {
                console.log(err)
              } else {
                connection.query('SELECT id_user FROM users ORDER BY id_user DESC LIMIT 1', (err, result) => {
                  if (err) {
                    console.log(err)
                  } else {
                    connection.query(
                      `INSERT INTO registrations(quantity_adult, quantity_children, allergie, comment, user_id, event_id) VALUES (${parseInt(values.numberAdults)}, ${parseInt(values.numberChildrens)}, '${values.allergie}', '${values.information}', ${parseInt(result[0].id_user, 10)}, ${parseInt(values.eventId, 10)})`,
                      (err, result) => {
                        if (err) {
                          console.log(err)
                        } else {
                          if (values.email) {
                            const data = { email: values.email, eventName: values.eventName, eventDate: values.eventDateB, nbAdults: values.numberAdults, nbChildrens: values.numberChildrens }
                            const repMail = sendEmail(data);
                            console.log(repMail)
                          }
                          res.sendStatus(200)
                        }
                      }
                    )
                  }
                })
              }
            }
          )
        } else {
          const resultEmail = result[0].email
          connection.query(
            `INSERT INTO registrations(quantity_adult, quantity_children, allergie, comment, user_id, event_id) VALUES (${parseInt(values.numberAdults)}, ${parseInt(values.numberChildrens)}, '${values.allergie}', '${values.information}', ${parseInt(result[0].id_user, 10)}, ${parseInt(values.eventId, 10)})`,
            (err, result) => {
              if (err) {
                console.log(err)
              } else {
                if (resultEmail) {
                  const data = { email: resultEmail, eventName: values.eventName, eventDate: values.eventDateB, nbAdults: values.numberAdults, nbChildrens: values.numberChildrens }
                  const repMail = sendEmail(data);
                  console.log(repMail)
                }
                res.sendStatus(200);
              }
            }
          )
        }
      }
    )
  } else {
    connection.query(
      `INSERT INTO users (firstname, lastname, email, phone, anonym) VALUES('${values.firstname}', '${values.lastname}', '${values.email}', '${values.phone}', false)`,
      (err, result) => {
        if (err) {
          console.log(err)
        } else {
          connection.query('SELECT id_user FROM users ORDER BY id_user DESC LIMIT 1', (err, result) => {
            if (err) {
              console.log(err)
            } else {
              connection.query(
                `INSERT INTO registrations(quantity_adult, quantity_children, allergie, comment, user_id, event_id) VALUES (${parseInt(values.numberAdults)}, ${parseInt(values.numberChildrens)}, '${values.allergie}', '${values.information}', ${parseInt(result[0].id_user, 10)}, ${parseInt(values.eventId, 10)})`,
                (err, result) => {
                  if (err) {
                    console.log(err)
                  } else {
                    if (values.email) {
                      const data = { email: values.email, eventName: values.eventName, eventDate: values.eventDateB, nbAdults: values.numberAdults, nbChildrens: values.numberChildrens }
                      const repMail = sendEmail(data);
                      console.log(repMail)
                    }
                    res.sendStatus(200)
                  }
                }
              )
            }
          })
        }
      }
    )
  }
});

//---------------------------------------------------EVENTS---------------------------------------------------------
api.get('/api/events/:id', (req, res) => {
  const idEvent = req.params.id;
  // console.log(idEvent);
  connection.query('SELECT * FROM events WHERE id_event = ?', idEvent, (err, result) => {
    if (err) throw err;
    let theEvents = result[0];
    // console.log(theEvents);
    // console.log(theEvents.id_event);
    if (result[0].name_event === '' || result[0].description_event === '' || result[0].picture_event === '') {
      connection.query('SELECT * FROM activities WHERE id_activity = ?', result[0].activity_id, (error, resultat) => {
        if (error) throw error;
        theEvents.name_event = theEvents.name_event !== '' ? theEvents.name_event : resultat[0].name_activity;
        theEvents.description_event = theEvents.description_event !== '' ? theEvents.description_event : resultat[0].description_activity;
        theEvents.picture_event = theEvents.picture_event !== '' ? theEvents.picture_event : resultat[0].picture_activity;
        res.send(result);
      })
    } else {
      res.send(result);
    }
  });
});



api.put('/api/events/:id', (req, res) => {
  const idEvent = req.params.id;
  const formData = req.body;
  const data = {
    date_b: formData.dateB,
    date_e: formData.dateE,
    name_event: formData.nameEvent,
    capacity: formData.capacity,
    address_event: formData.addressEvent,
    description_event: formData.descriptionEvent,
    picture_event: formData.pictureEvent,
    activity_id: formData.activityId,
  }
  connection.query('UPDATE events SET ? WHERE id_event = ?', [data, idEvent], err => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la modification d'un nouveau evenement");
    } else {
      res.sendStatus(200);
    }
  });
});



api.listen(8000, 'localhost', (err) => {
  if (err) throw err;
  console.log('API is running on localhost:8000');
});
