import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import { message, Row, Col, TimePicker,  DatePicker } from 'antd';
import conf from '../../app.conf';
import moment from 'moment';

// CSS
import './EventManager.css';

// ACTIONS
import { initEventsAction, createEventAction } from '../../Actions/adminActions';

const EventManager = ({ idevent, events, dispatch }) => {
  const [labelActive, setLabelActive] = useState('');
  const format = 'HH:mm';

  const [id, setId] = useState();
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [city, setCity] = useState('');
  const [capacity, setCapacity] = useState();

  const [newEvent, setNewEvent] = useState({});

  // api call if events not existing in store
  useEffect(() => {
    if (!events) {
      axios.get(`${conf.url}/api/events/curdate`)
        .then((result) => {
          dispatch(initEventsAction({events: result.data}));
      });
    }
  }, [dispatch, events]);

  useEffect(() => {
    console.log(`events from store`);
    console.log(events);
    console.log(`props : `);
    console.log(idevent);
  }, [events, idevent]) 



  const insertNewEvent = () => {
    let resultat = {};
    console.log('nous allons créé un nouvel evenement dans la BDD');
    axios.post(`${conf.url}/api/events/`, newEvent)
      .then((res) => {
        message.success("L'enregistrement a bien été pris en compte en BDD", 3);
        resultat = res.status;
        console.log(resultat);
      })
      .then(() => {
        console.log('ici on va mettre a jour le store')
        if (resultat === 200) {
          dispatch(createEventAction(newEvent));
        } else {
          message.warning(resultat, 3);
        }
      })
      .catch(() => {
        message.error("Une erreur s'est produite. Merci de réessayer", 3);
      });
    setId('');
    setAddress('');
    setDate('');
    setHour('');
    setCity('');
    setCapacity('');
  };

  useEffect(() => {
    const eventTemp = {
      id,
      address,
      date,
      hour,
      city,
      capacity,
    };
    setNewEvent(eventTemp);
  }, [id, address, date, hour, city, capacity]);

  

  return (
    <div className="container form-event">
      <Row>
        <Col sm={24} md={12} className="input-field">
          <i className="material-icons prefix"></i>
          <input
            value={idevent !== null ? idevent : ''}
            onChange={e => setCapacity(e.target.value)}
            id="id"
            type="text"
            className="validate"
          />
          <label className={labelActive} htmlFor="id">
            n° évènement
          </label>
        </Col>
      </Row>
      <Row>
        <Col sm={24} md={12} className="input-field pickers">
          <DatePicker
            locale="fr"
            dateFormat="dd/MM/yyyy"
            selected={date && new Date(date)}
            onChange={date => date && setDate(moment(date._d).format('YYYY-MM-DD'))}
          />
        </Col>
        <Col sm={24} md={12} className="input-field pickers">
          <TimePicker 
            defaultValue={moment('14:00', format)} 
            format={format} 
            selected={hour && new Date(hour)}
            onChange={hour => hour && setHour(moment(hour._d).format('HH:mm'))}
          />
        </Col>
      </Row>
      <Row>
        <Col sm={24} md={12} className="input-field">
          <i className="material-icons prefix">people</i>
          <input
            value={capacity !== null ? capacity : ''}
            onChange={e => setCapacity(e.target.value)}
            id="capacity"
            type="text"
            className="validate"
          />
          <label className={labelActive} htmlFor="capacity">
            capacity
          </label>
        </Col>
      </Row>
      <Row>
        <Col sm={24} md={12} className="input-field">
          <i className="material-icons prefix">location_on</i>
          <input
            value={address !== null ? address : ''}
            onChange={e => setAddress(e.target.value)}
            id="address"
            type="text"
            className="validate"
          />
          <label className={labelActive} htmlFor="address">
            Adresse
          </label>
        </Col>
      </Row>
      <Row>
        <Col sm={24} md={12} className="input-field">
          <i className="material-icons prefix">location_on</i>
          <input
            value={city && city}
            onChange={e => setCity(e.target.value)}
            id="city"
            type="text"
            className="validate"
          />
          <label className={labelActive} htmlFor="city">
            Ville
          </label>
        </Col>
      </Row>
      <Row>
        <Col sm={24} md={6} className="input-field">
          <button
            type="button"
            className="waves-effect waves-light btn-small teal darken-1 white-text right col s4"
            onClick={() => insertNewEvent(newEvent)}
          >
            Envoyer
          </button>
        </Col>
      </Row>
    </div>
  );
}

const mapStateToProps = store => ({
  events: store.events,
});

EventManager.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object),
  idevent: PropTypes.number,
  dispatch: PropTypes.func,
};

EventManager.defaultProps = {
  events: mapStateToProps.events,
  idevent: null,
  dispatch: null,
};

export default connect(mapStateToProps)(EventManager);
