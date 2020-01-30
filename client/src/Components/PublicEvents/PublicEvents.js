import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';
import conf from '../../app.conf';

// CSS
import './PublicEvents.css';
import 'antd/dist/antd.css';


// ACTIONS REDUX
import { initEventsAction } from '../../Actions/adminActions';

function PublicEvents({ dispatch }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get(`${conf.url}/api/events/curdate`)
      .then((result) => {
        dispatch(initEventsAction({events: result.data}));
        setEvents(result.data);
      });
  }, [dispatch]);

  return (
    <div className="container">
      <div className="row title">
        <h3 className="deep-purple-text darken-4">Dates de Spectacles</h3>
      </div>
        
      <div className="row list-events">

        {/* entetes liste des évenements */}
        <ul className="event-header">
          <li className="col l1 hide-on-med-and-down">Id</li>
          <li className="col s2">Date</li>
          <li className="col s3 m2">Lieu</li>
          <li className="col l4 hide-on-med-and-down">Adresse</li>
          <li className="col s1">Capacité</li>
          <li className="col s1"><i className="material-icons icon-green">create</i></li>
          <li className="col s1"><i className="material-icons icon-green">delete_forever</i></li>
        </ul>

        {/* liste des evenements */}
        {events.map((event, index) => (
          <div className="event" key={event.id_event} data-genre={event.name_event}>
            <ul className="event-item row">
              <li className="col l1 hide-on-med-and-down">{event.id_event}</li>
              <li className="col s2">{moment(event.date_event).format('DD/MM HH:mm')}</li>
              <li className="col s3 m2">{event.city_event}</li>
              <li className="col l4 hide-on-med-and-down">{event.address_event}</li>
              <li className="col s1">{event.total_booking}/{event.capacity}</li>
              <li className="col s1">
                <Link to={`/booking`} idEvent={event.id_event}>Réserver</Link>
              </li>
            </ul>
          </div>
        ))}

      </div>
    </div>
  );
}

const mapStateToProps = store => ({
  events: store.events,
});

PublicEvents.propTypes = {
  dispatch: PropTypes.func,
  events: PropTypes.arrayOf(PropTypes.object),
};

PublicEvents.defaultProps = {
  dispatch: null,
  events: mapStateToProps.events,
};

export default connect(mapStateToProps)(PublicEvents);
