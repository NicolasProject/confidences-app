import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import logoSquare from '../assets/img/logo-square.png';
import { isLoggedIn } from '../services/AuthService';
import MyLink from './utils/Link';
import navLinks from '../config/navLinks';
import { withNotification } from '../services/withNotification';
import TopBar from './utils/TopBar';


export default withNotification(() => (
  <>
    <TopBar>{'Comme vous l\'avez peut-être constaté, notre site internet a changé de nom de domaine. ↑ Nous avons fait cette modification volontairement pour harmoniser notre identité. Rien de change pour autant ! Bonne visite !'}</TopBar>
    <nav className="navbar navbar-toggleable-lg navbar-light hidden-xl-up">
      <button
        className="navbar-toggler navbar-toggler-right align-self-center"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <Link className="navbar-brand" to="/">
        <img src={logoSquare} width="auto" height="64" alt="Logo Confidences d'Abeilles" />
        <h2
          className="badge badge-danger"
          style={{
            position: 'absolute',
            top: '75px',
            left: '75px',
            fontSize: '1.5em',
            zIndex: 1000,
          }}
        >
          {(process.env.NODE_ENV === 'development') ? 'Bêta' : null}
        </h2>
      </Link>
      <div
        className="hidden-xl-up collapse"
        style={{ justifyContent: 'space-between' }}
        id="navbarNav"
        role="button"
        onClick={() => {
          document.getElementById('navbarNav')
            .classList
            .remove('show');
        }}
      >
        <ul className="navbar-nav">
          {isLoggedIn() ? navLinks.mobile.loggedIn.map(({ label, ...props }) => (
            <li key={props.url} className="nav-item">
              <MyLink className="nav-link" {...props}>{label}</MyLink>
            </li>
          )) : (
            <Fragment>
              {navLinks.mobile.visitors.map(({ label, ...props }) => (
                <li key={props.url} className="nav-item">
                  <MyLink className="nav-link" {...props}>{label}</MyLink>
                </li>
              ))}
            </Fragment>
          )}
        </ul>
      </div>
    </nav>
  </>
));
