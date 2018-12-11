import React, { Component } from 'react';
import NotificationSystem from 'react-notification-system';
import ReactGA from 'react-ga';
import request from '../services/Net';
import { handleChange } from '../services/FormService';
import Meta from './utils/Meta';

export default class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      ok: false,
    };
    ReactGA.pageview(this.props.location.pathname);
  }

  resetPassword(e) {
    e.preventDefault();
    request({
      url: '/user/ask',
      method: 'post',
      data: {
        email: this.state.email,
      },
    }, this.refs.notif).then((res) => {
      this.setState({
        ok: true,
      });
    });
  }

  render() {
    return (
      <div className="container">
        <Meta title="Mot de passe oublié" />
        <NotificationSystem ref="notif" />
        <div className="row justify-content-center">
          <div className="col-4">
            <h2 className="text-center my-4">Mot de passe oublié</h2>
            {this.state.ok
              ? (
                <p className="alert alert-success">
                Un email de récupération vient de vous être envoyé.

                </p>
              )
              : (
                <form onSubmit={this.resetPassword.bind(this)} className="text-center">
                  <div className="form-group">
                    <input type="email" className="form-control" name="email" onChange={handleChange.bind(this)} placeholder="Adresse email" />
                  </div>
                  <button className="btn btn-primary">Envoyer un email de récupération</button>
                </form>
              )}
          </div>
        </div>
      </div>
    );
  }
}
