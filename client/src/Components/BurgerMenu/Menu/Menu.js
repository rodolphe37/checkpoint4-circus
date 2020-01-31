import React from 'react';
import { bool } from 'prop-types';
import { StyledMenu } from './Menu.styled';
import { NavLink } from 'react-router-dom';

const Menu = ({ open, ...props }) => {
  
  const isHidden = open ? true : false;
  // const tabIndex = isHidden ? 0 : -1;

  return (
    <StyledMenu open={open} aria-hidden={!isHidden} {...props}>
    <a><NavLink exact to="/"><span aria-hidden="true">💁🏻‍♂️Le Spectacle</span></NavLink></a>
    <a> <NavLink exact to="/dates"><span aria-hidden="true">💸La Billetterie</span></NavLink></a>
    <a> <NavLink exact to="/admin"><span aria-hidden="true">📩Admin</span></NavLink></a>
  </StyledMenu>

  )
}

Menu.propTypes = {
  open: bool.isRequired,
}

export default Menu;
