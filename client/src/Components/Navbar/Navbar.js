import React, {useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../../images/logo64.png'
// CSS
import 'materialize-css/dist/css/materialize.min.css';
import './Navbar.css';

const Navbar = () => {
  const [sidebarHidden, setSidebarHidden] = useState(true);

  return (
    <div>
      <nav className="deep-purple darken-3">
        <div className="nav-wrapper">
          <a href="#!" className="brand-logo"><img alt='logo' src={Logo} /></a>
          <a href="to" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
          <ul className="right hide-on-med-and-down">
            <li><NavLink exact to="/">Le Spectacle</NavLink></li>
            <li><NavLink exact to="/dates">La Billetterie</NavLink></li>
            {/* <li><NavLink exact to="/company">La Compagnie</NavLink></li> */}
            <li><NavLink exact to="/admin"><i className="material-icons">lock_outline</i></NavLink></li>
          </ul>
        </div>
      </nav>
      <ul className="sidenav" id="mobile-demo">
        <li><NavLink onClick={() => setSidebarHidden(!sidebarHidden)} exact to="/">Le Spectacle</NavLink></li>
        <li><NavLink onClick={() => setSidebarHidden(!sidebarHidden)} exact to="/booking">La Billetterie</NavLink></li>
        {/* <li><NavLink onClick={() => setSidebarHidden(!sidebarHidden)} exact to="/company">La Compagnie</NavLink></li> */}
        <li><NavLink onClick={() => setSidebarHidden(!sidebarHidden)} exact to="/admin"><i className="material-icons">lock_outline</i></NavLink></li>
      </ul>
    </div>
  );
}

export default Navbar;
