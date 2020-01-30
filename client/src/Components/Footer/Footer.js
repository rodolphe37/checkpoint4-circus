import React from 'react';
// import { NavLink } from 'react-router-dom';

// CSS
import 'materialize-css/dist/css/materialize.min.css';
import './Footer.css';

function Footer() {
  return (
    <footer className="page-footer deep-purple darken-3">
      <div className="footer-copyright">
        <div className="container">
        Copyright © 2020 
          <a className="grey-text text-lighten-4 right" href="https://wildcodeschool.fr/">Wild Code School</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
