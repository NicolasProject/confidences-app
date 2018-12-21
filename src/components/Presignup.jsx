import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Meta from './utils/Meta';
import { isLoggedIn } from '../services/AuthService';

export default class Presignup extends Component {
  state = {
    redirect: false,
  }

  componentDidMount() {
    if (isLoggedIn(true)) {
      this.setState({ redirect: 'account' });
    }
  }

  render() {
    const { redirect } = this.state;
    return (
      <div className="container">
        {redirect && <Redirect to={`/${redirect}`} />}
        <Meta title="Créer un compte" />
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <h2 className="text-center my-5">Je suis ...</h2>
            <p className="text-center">
              <Link to="/signup/company" className="btn btn-secondary m-2 btn-lg">Une Entreprise</Link>
              <Link to="/signup/individual" className="btn btn-secondary m-2 btn-lg">Un Particulier</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
