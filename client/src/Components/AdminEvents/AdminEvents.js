import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';
import { Modal, message } from 'antd';
import conf from '../../app.conf';

// CSS
import './AdminEvents.css';
import 'antd/dist/antd.css';


// ACTIONS REDUX
import { initEventsAction, removeEventAction } from '../../Actions/adminActions';

function AdminEvents({ dispatch }) {
  const [deleteModal, setDeleteModal] = useState([]);
  const [events, setEvents] = useState([]);

  // to delete an event
  const deleteEvent = (id) => {
    axios.delete(`${conf.url}/api/event/${id}`)
      .then((res) => {
        if (res.status === 200) {
          message.success(res.data, 3);
          dispatch(removeEventAction(id));
          setEvents(res.data);
        } else {
          message.warning(res.status, 3);
        }
      })
      .catch((err) => {
        message.error(`évènement ${id} ne peut pas être supprimé: ${err}`, 3);
      });
  };

  // api call while loading
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
        <h3 className="deep-purple-text darken-4">Dates à venir</h3>
      </div>

      <div className="row new-event">
        <ul>
          <Link to="/events/">
          <button type="button" class="waves-effect waves-light btn-small teal darken-1 white-text right col s4">créer une nouvelle date</button>
          </Link>
        </ul>
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
                <Link to={`/events/${event.id_event}`} idevent={event.id_event}>
                  <i className="material-icons">create</i>
                </Link>
              </li>
              <li className="col s1">
                <button
                  type="submit"
                  className="button link-button"
                  onClick={() => setDeleteModal([
                    ...deleteModal.slice(0, [index]),
                    !deleteModal[index],
                    ...deleteModal.slice([index + 1], deleteModal.length),
                  ])}
                >
                  <i className="material-icons">delete_forever</i>
                </button>
                <Modal
                  title={`Vous aller supprimer l'évènement n° ${event.id_event}: `}
                  visible={deleteModal[index]}
                  onOk={() => {
                    setDeleteModal([
                      ...deleteModal.slice(0, [index]),
                      !deleteModal[index],
                      ...deleteModal.slice([index + 1], deleteModal.length),
                    ]);
                    deleteEvent(event.id_event);
                  }}
                  onCancel={() => {
                    setDeleteModal([
                      ...deleteModal.slice(0, [index]),
                      !deleteModal[index],
                      ...deleteModal.slice([index + 1], deleteModal.length),
                    ]);
                  }}
                  footer={[
                    <button
                      type="submit"
                      key="back"
                      onClick={() => {
                        setDeleteModal([
                          ...deleteModal.slice(0, [index]),
                          !deleteModal[index],
                          ...deleteModal.slice([index + 1], deleteModal.length),
                        ]);
                      }}
                    >
                      annuler
                    </button>,
                    <button
                      type="submit"
                      key="submit"
                      onClick={() => {
                        setDeleteModal([
                          ...deleteModal.slice(0, [index]),
                          !deleteModal[index],
                          ...deleteModal.slice([index + 1], deleteModal.length),
                        ]);
                        deleteEvent(event.id_event);
                      }}
                    >
                      Supprimer
                    </button>,
                  ]}
                >
                  <p>{moment(event.date_event).format('dddd DD/MM/YY HH:mm')}</p>
                  <p>{event.city_event}</p>
                  <p>{event.address_event}</p>
                  <p>{event.total_booking}{' réservations'}</p>
                </Modal>
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

AdminEvents.propTypes = {
  dispatch: PropTypes.func,
  events: PropTypes.arrayOf(PropTypes.object),
};

AdminEvents.defaultProps = {
  dispatch: null,
  events: mapStateToProps.events,
};

export default connect(mapStateToProps)(AdminEvents);
