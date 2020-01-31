import React, {useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../../images/logo64.png'
// CSS
import 'materialize-css/dist/css/materialize.min.css';
import './Navbar.css';
import { Menu } from '../BurgerMenu/index';

const Navbar = () => {
  const [sidebarHidden, setSidebarHidden] = useState(true);

  return (
    <div>
      <nav className="deep-purple darken-3">
        <div className="nav-wrapper">
        <Menu />
          <a href="#!" className="brand-logo"><img alt='logo' src={Logo} /></a>
          
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
