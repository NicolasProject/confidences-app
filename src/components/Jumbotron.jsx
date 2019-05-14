import styled from '@emotion/styled';
import { Item, Rows } from './utils/layout/Flex';
import { ButtonLink } from './utils/Button';
import first from '../assets/img/homepage/4.jpg';
import React from 'react';
import PropTypes from 'prop-types';


const JumbotronWrapper = styled(Rows)`
  align-items: stretch;
  background-color: #111;
  overflow: hidden;
  min-height: 20rem;
`;


const Jumbcontent = styled(Item)`
  color: #DDD;
  flex: 1;
  z-index: 10;
  position: relative;
  &::after {
    content: ' ';
    width: 100%;
    transform: rotate(7deg);
    background-color: #111;
    right: 0;
    display: block;
    right: -10%;
    top: -200%;
    z-index: -1;
    height: 600%;
    position: absolute;
  }
`;

const JumboImage = styled(Item)`
  width: 100%;
  align-self: stretch;
  background-image: ${props => `url("${props.src}")`};
  background-size: cover;
  background-position: center;
  @media(max-width: 800px) {
    display: none;
  }
`;

const Jumbotron = ({ children, img }) => (
  <JumbotronWrapper>
    <Jumbcontent>
      {children}
    </Jumbcontent>
    <JumboImage src={img} />
  </JumbotronWrapper>
);

Jumbotron.propTypes = {
  img: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Jumbotron;
