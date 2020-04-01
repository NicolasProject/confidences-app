import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

import MyLink from '@cda/link';
import ButtonLink from '@cda/button-link';
import logoSquare from '../assets/img/logo-square.png';
import { isLoggedIn } from '../services/AuthService';
import navLinks from '../config/navLinks';
import { withNotification } from '../services/withNotification';
import NewsletterPopup from './NewsletterPopup';

const Wrapper = styled('nav')`
  display: flex;
  flex-direction: row;
  align-items: top;
  justify-content: space-between;
  flex-wrap: no-wrap;
  padding: 1rem;
  width: 100%;
  height: 100px;
  background-color: white;
  @media (max-width: 1201px) {
    display: none;
  }
`;

const Section = styled('div')`
  display: flex;
  flex: 3;
  align-items: center;
  flex-wrap: wrap;
  justify-content: start;
  height: 64px;
`;

const RightSection = styled(Section)`
  justify-content: end;
  flex: 2;
`;

const DropdownPostion = styled('div')`
  position: relative;
  width: 100px;
`;

const DropdownWrapper = styled('div')`
  position: absolute;
  height: auto;
  z-index: 1000;
  top: 3rem;
  box-shadow: 0 0 3px silver;
  background-color: white;
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};;
  flex-direction: column;
  overflow: hidden;
`;

const DropdownElement = styled(MyLink)`
  padding: 0.5rem 1rem;
  flex: 1;
  width: 20rem;
`;

const Dropdown = ({ data, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleHandler = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <DropdownPostion>
      <a href="/" onClick={toggleHandler} style={{ color: 'black' }}>{title}</a>
      <DropdownWrapper onMouseLeave={toggleHandler} isOpen={isOpen}>
        {data.map(({ label, ...props }) => (
          <DropdownElement
            key={props.to}
            {...props}
          >
            {label}
          </DropdownElement>
        ))}
      </DropdownWrapper>
    </DropdownPostion>
  );
};

export default withNotification(() => (
  <Wrapper>
    <Section>
      <Link to="/">
        <img src={logoSquare} width="auto" height="64" alt="Logo Confidences d'Abeilles" />
      </Link>
      {navLinks.desktop.visitors.map(({ label, ...props }) => (
        <MyLink className="nav-link" key={label} {...props}>{label}</MyLink>
      ))}
      <Dropdown title="Agir" data={navLinks.desktop.dropdown1} />
    </Section>
    <RightSection>
      <a href="#">S'inscrire à la Newsletter</a>&nbsp;&nbsp;&nbsp;
      <Dropdown title="L'association" data={navLinks.desktop.dropdown2} />
      {isLoggedIn()
        ? (
          <>
            <ButtonLink to="/account" primary>Mon Compte</ButtonLink>
            <ButtonLink to="/logout">Deconnexion</ButtonLink>
          </>
        ) : (
          <>
            <ButtonLink to="/login" primary>Se connecter</ButtonLink>
            <ButtonLink to="/presignup" data-cy="create-account">Créer un compte</ButtonLink>
          </>
        )}
    </RightSection>
    <NewsletterPopup />
  </Wrapper>
));
