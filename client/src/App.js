import React, { useState, useRef }  from 'react';
import { Route } from 'react-router-dom';

import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import Performance from './Components/Performance/Performance';
import Booking from './Components/Booking/Booking';
import PublicEvents from './Components/PublicEvents/PublicEvents';
import AdminEvents from './Components/AdminEvents/AdminEvents';
import EventManager from './Components/EventManager/EventManager';

import { ThemeProvider } from 'styled-components';
import { useOnClickOutside } from './hooks';
import { theme } from './theme';
import { Burger, Menu } from './Components/BurgerMenu';
import FocusLock from 'react-focus-lock';


import './App.css';

function App() {
  const [open, setOpen] = useState(false);
  const node = useRef();
  const menuId = "main-menu";

  useOnClickOutside(node, () => setOpen(false));
  return (
    <div id="background">
    <Navbar />
    <ThemeProvider theme={theme}>
    <div id="menu">
      <div ref={node}>
        <FocusLock disabled={!open}>
          <Burger open={open} setOpen={setOpen} aria-controls={menuId} />
          <Menu open={open} setOpen={setOpen} id={menuId} />
        </FocusLock>
      </div>
      
    </div>
  </ThemeProvider>
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
