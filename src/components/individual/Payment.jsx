import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Elements } from 'react-stripe-elements';

import { withRouter } from 'react-router';
import request from '../../services/Net';
import PayForm from '../utils/PayForm';
import Meta from '../utils/Meta';
import { withNotification } from '../../services/withNotification';

class IndividualPayement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    };

    this.nbBees = undefined;
  }

  componentDidMount() {
    const { notification } = this.props;
    request({
      url: '/user/me',
      method: 'get',
    }, notification)
      .then((res) => {
        this.setState({
          price: res.bundles[0].price,
          bundle_id: res.bundles[0].id,
          name: res.name,
          firstname: res.firstname,
        });
        this.nbBees = res.bundles[0].bees;
      });
  }

  updateBundleState = (state) => {
    console.log(this.props);
    const { notification, history } = this.props;
    return new Promise(() => {
      request({
        url: `/bundle/${this.state.bundle_id}`,
        method: 'put',
        data: {
          state,
        },
      }, notification).then(() => {
        history.push('/individual/manage');
      });
    });
  };

  render() {
    return (
      <div className="container py-4">
        <Meta title="Paiement" />
        {(this.state.redirect) ? <Redirect to="/individual/end" /> : null}
        <div className="row">
          <div className="col-lg-12">
            <h2 className="text-center">Régler mon parrainage</h2>
          </div>
          <div className="col-lg-6">
            <h3 className="text-center my-4"><small>Paiement sécurisé par carte bancaire</small></h3>
            <Elements locale="fr">
              <PayForm price={this.state.price} nbBees={this.nbBees} bundle={this.state.bundle_id} date={(this.state.present) ? this.state.start_date : new Date()} for={`${this.state.firstname} ${this.state.name}`} endpoint="/individual/end" />
            </Elements>
          </div>
          <div className="col-lg-6" style={{ borderStyle: 'solid', borderColor: '#E49C00', borderWidth: '0 0 0 4px' }}>
            <h3 className="text-center my-4"><small>Paiement par virement bancaire</small></h3>
            <p>Veuillez trouver nos coordonnées bancaires pour procéder au virement</p>
            <p>
              <strong>Domiciliation : </strong>
QONTO - 92641 BOULOGNE-BILLANCOURT
              <br />
              <strong>IBAN : </strong>
FR76 1679 8000 0100 0004 1298 259
              <br />
              <strong>BIC : </strong>
TRZOFR21XXX
              <br />
              <br />
              <strong>Numéro de facture à indiquer dans la référence du virement : </strong>
              {this.state.bill_number}
            </p>
            <p>
              Si votre banque vous impose	un	délai	concernant	l’ajout	d’un	nouveau	compte	bénéficiaire,	nous	vous
              invitons	à	sélectionner	«	Bénéficiaire ajouté	».	Un	mail	vous	conviant	à	confirmer	votre	virement	vous	sera
              alors	adressé	3	jours	plus	tard.
              {' '}
              <br />
              De	notre	côté,	la	validation	de	votre	virement	sera	faite	sous	48h.
            </p>
            <p className="text-center">
              <button onClick={this.updateBundleState.bind(this, 0)} className="btn btn-primary">Bénéficiaire ajouté</button>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <button onClick={this.updateBundleState.bind(this, 1)} className="btn btn-primary">Virement effectué</button>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(withNotification(IndividualPayement));
