import React from 'react';
import { Route } from 'react-router-dom';

import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import Performance from './Components/Performance/Performance';
import Booking from './Components/Booking/Booking';
import PublicEvents from './Components/PublicEvents/PublicEvents';
import AdminEvents from './Components/AdminEvents/AdminEvents';
import EventManager from './Components/EventManager/EventManager';

import './App.css';

function App() {
  return (
    <div id="background">
      <Navbar />
      <Route path="/" exact component={Performance} />
      <Route path="/dates" exact component={PublicEvents} />
      <Route path="/booking" exact component={Booking} />
      <Route path="/admin" exact component={AdminEvents} />
      <Route path="/events/*" exact component={EventManager} />
      <Footer />
    </div>
  );
}

export default App;
