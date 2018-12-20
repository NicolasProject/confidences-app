import React, { Component } from 'react';
import request from '../../services/Net';
import { isLoggedIn } from '../../services/AuthService';
import { Redirect } from 'react-router-dom';
import NotificationSystem from 'react-notification-system';

import Meta from '../utils/Meta'

export default class ContributorWish extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      redirect : false
    }
  }

  selectContract() {
    request({
      url : '/contract',
      method : 'post',
      data : {
        duration : 1
      }
    }, this.refs.notif)
    .then((res) => {
      this.setState({ redirect : true})
    })
  }

  render () {
    return (
      <div className="container py-4">
        <Meta title="Contrat"/>
        <NotificationSystem ref="notif" />
        {(isLoggedIn())?null:<Redirect to="/" />}
        {(this.state.redirect)?
        <Redirect to="/contributor/checkout" />
        :null}
        <div className="row justify-content-center">
          <div className="col">
            <div className="progress">
              <div className="progress-bar" role="progressbar" style={{width: '75%'}}></div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-9">
            <h2 className="text-center mt-4">
              Je m’apprête à signer un contrat de type ponctuel.
            </h2>
            <p className="text-center lead my-4">De quel type de contrat s’agit-il ?</p>
            <ul>
              <li>Le contrat proposé par Confidences d’Abeilles, le commanditaire, vous
permet en tant qu’apporteur d’affaires de bénéficier d’une rétribution pour
votre travail de réseau.</li>
<li>
  Il définit notamment l’objet de la collaboration, les engagements respectifs
des parties et le mode de calcul de la rétribution.
</li>
<li>
  Il est dans l’intérêt des parties de disposer d’un tel contrat. Nous vous
invitions à le parcourir dans son intégralité avant de le signer.
</li>
            </ul>
            <p className="text-center">
            <button onClick={this.selectContract.bind(this)} className="btn btn-primary">Continuer</button>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
