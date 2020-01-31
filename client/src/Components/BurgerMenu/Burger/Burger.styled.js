import styled from 'styled-components';

export const StyledBurger = styled.button`
  position: fixed;
  top: 5%;
  left: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: rgba(0,0,0, .5);
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
  border-radius: 5px;
  box-shadow: 1px 1px 2px black;


  span {
    width: 2rem;
    height: 0.25rem;
    background:#d6554f;
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;
    font-size: 12px;
    &:hover {
      background: black;
    }

    :first-child {
      transform: ${({ open }) => open ? 'rotate(45deg)' : 'rotate(0)'};
    }

    :nth-child(2) {
      opacity: ${({ open }) => open ? '0' : '1'};
      transform: ${({ open }) => open ? 'translateX(20px)' : 'translateX(0)'};
    }

    :nth-child(3) {
      transform: ${({ open }) => open ? 'rotate(-45deg)' : 'rotate(0)'};
    }
  }
`;
