import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message, Row, Col } from 'antd';
import conf from '../../app.conf';

// CSS
import './Booking.css';

const Booking = (props) => {
  const [labelActive, setLabelActive] = useState('');

  const [events, setEvents] = useState();
  const [idEvent, setIdEvent] = useState();

  const [firstname, setFirstname] = useState();
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [quantity, setQuantity] = useState('');
  const [eventId, setEventId] = useState('');
  const [userId, setUserId] = useState();

  const [newBooking, setNewBooking] = useState({});

  useEffect(() => {
    axios.get(`${conf.url}/api/events/curdate`)
      .then((result) => {
        setEvents(result.data);
        console.log(result.data)
    });
  }, []);

  useEffect(() => {
    console.log(props);
      setIdEvent(props.idEvent)
  }, [props])

  const insertNewBooking = () => {
    let resultat = {};
    console.log('nous allons créé une résa dans la BDD');
    axios.post(`${conf.url}/api/bookings/`, newBooking)
      .then((res) => {
        message.success("La réservation a bien été pris en compte", 3);
        resultat = res.status;
        console.log(resultat);
      })
      .catch(() => {
        message.error("Une erreur s'est produite. Merci de réessayer", 3);
      });
    setFirstname('');
    setLastname('');
    setEmail('');
    setPhone('');
    setQuantity('');
    setEventId('');
    setUserId('');
  };

  useEffect(() => {
    const bookingTemp = {
      firstname,
      lastname,
      email,
      phone,
      quantity,
      eventId,
      userId,
    };
    setNewBooking(bookingTemp);
  }, [firstname, lastname, email, phone, quantity, eventId, userId]);


  return (
    <div className="container form-event">
      <Row>
        <Col sm={24} md={12} className="input-field">
          <h3>Réservation Billeterie</h3>
          <p>vous allez réserver vos billets pour l'évènement suivant: {idEvent}</p>
        </Col>
      </Row>
      <Row>
        <Col sm={24} md={12} className="input-field">
          <i className="material-icons prefix"></i>
          <input
            value={firstname}
            onChange={e => setFirstname(e.target.value)}
            id="firstname"
            type="text"
            className="validate"
          />
          <label className={labelActive} htmlFor="firstname">
            firstname
          </label>
        </Col>
      </Row>
      <Row>
        <Col sm={24} md={12} className="input-field">
          <i className="material-icons prefix"></i>
          <input
            value={lastname}
            onChange={e => setLastname(e.target.value)}
            id="lastname"
            type="text"
            className="validate"
          />
          <label className={labelActive} htmlFor="lastname">
            lastname
          </label>
        </Col>
      </Row>
      <Row>
        <Col sm={24} md={12} className="input-field">
          <i className="material-icons prefix"></i>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            id="email"
            type="text"
            className="validate"
          />
          <label className={labelActive} htmlFor="email">
            email
          </label>
        </Col>
      </Row>
      <Row>
        <Col sm={24} md={12} className="input-field">
          <i className="material-icons prefix"></i>
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            id="phone"
            type="text"
            className="validate"
          />
          <label className={labelActive} htmlFor="phone">
            phone
          </label>
        </Col>
      </Row>     
      <Row>
        <Col sm={24} md={12} className="input-field">
          <i className="material-icons prefix"></i>
          <input
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            id="quantity"
            type="text"
            className="validate"
          />
          <label className={labelActive} htmlFor="quantity">
            quantity
          </label>
        </Col>
      </Row>
      <Row>
        <Col sm={24} md={6} className="input-field">
          <button
            type="button"
            className="waves-effect waves-light btn-small teal darken-1 white-text right col s4"
            onClick={() => insertNewBooking(newBooking)}
          >
            Envoyer
          </button>
        </Col>
      </Row>
    </div>
  );
}

export default Booking;
