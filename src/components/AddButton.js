import React from 'react';
import styled from 'styled-components';

const Add = styled.button`
  background: linear-gradient(90deg, #00d4ff, #2075c8);
  color: black;
  font-weight: 900;
  width: 135px;
  height: 68px;
  border: 1px solid #928574;
  border-radius: 0;
  font-size: 1rem;
  display: inline-block;
  transition: all 0.5s;
  text-align: left;
  vertical-align: middle;
  position: relative;
  &[disabled] {
    opacity: 0.5;
  }
  &:hover {
    opacity: 0.8;
  }
  &::after {
    content: '\\2713';
    text-align: center;
    height: 55px;
    width: 55px;
    background-color: white;
    border-radius: 50%;
    display: inline-block;
    vertical-align: middle;
    line-height: 52px;
    text-align: center;
    position: absolute;
    right: 5px;
    top: 5px;
    font-size: 40px;
    font-weight: 500;
    overflow: hidden;
  }
`;

const AddButton = ({ text, onClick, ariaLabel }) => {
  return (
    <Add
      aria-label={ariaLabel}
      type='button'
      onClick={item => onClick(item.objectID)}
    >
      {text}
    </Add>
  );
};

export default AddButton;
