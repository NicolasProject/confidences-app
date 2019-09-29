import React, { Component } from 'react';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import { Elements } from 'react-stripe-elements';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { withRouter } from 'react-router';
import { Button } from '@cda/button';
import request from '../../services/Net';
import { handleChange, handleTick } from '../../services/FormService';
import PayForm from '../utils/PayForm';
import Address from '../utils/Address/Address';
import Meta from '../utils/Meta';
import ViewAddress from '../utils/Address/ViewAddress';
import { withNotification } from '../../services/withNotification';
import { withTranslation } from 'react-i18next';


class IndividualCheckout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bsexe_m: '',
      dsexe_m: '',
      billing_name: '',
      billing_firstname: '',
      billing_address1: '',
      billing_address2: '',
      billing_address3: '',
      billing_address4: '',
      billing_zipcode: '',
      billing_city: '',
      redirect: false,
      bees: 0,
      saved: false,
      present: false,
      present_date: moment(new Date()),
      present_message: '',
      present_email: '',
      present_ok: false,
      dphone: '',
      feedback: '',
      back: false,
      dash: false,
      present_name: '',
      present_firstname: '',
      name: '',
      firstname: '',
    };

    this.bankTransfer = this.bankTransferEnum.NO_TRANSFER;
  }

  bankTransferEnum = Object.freeze({
    NO_TRANSFER: 0,
    BANK_ACCOUNT_ADDED: 1,
    BANK_TRANSFER_DONE: 2,
  });

  componentDidMount() {
    const { notification } = this.props;
    request({
      url: '/user/me',
      method: 'get',
    }, notification)
      .then((res) => {
        this.setState({
          user: res,
          name: res.name,
          firstname: res.firstname,
          bees: res.bundles[0].bees,
          price: res.bundles[0].price,
          bundle_id: res.bundles[0].id,
          duplicate: true,
          feedback: res.bundles[0].feedback,
          present: res.bundles[0].present,
          present_message: res.bundles[0].message,
          present_email: res.bundles[0].email,
          present_firstname: res.bundles[0].firstname,
          present_name: res.bundles[0].name,
          present_date: res.bundles[0].start_date
            ? moment(res.bundles[0].start_date) : moment(new Date()),
          bundleState: res.bundles[0].state,
        });

        request({
          url: `/bill/bundle/${res.bundles[0].id}`,
          method: 'get',
        }, notification).then((res) => {
          this.setState({ bill_number: res.number });
        });
        res.addresses.forEach((address) => {
          if (address.type === 1) {
            this.setState({ billing_address: address });
          } else if (address.type === 2) {
            this.setState({
              delivery_address: address,
            });
          }
        });
      });
  }

  handleDateChange = (date) => {
    if (date >= new Date().setDate(new Date().getDate() - 1)) {
      this.setState({
        present_date: date,
      });
    }
  };

  setBankTransfer = (done) => {
    const { history } = this.props;
    this.bankTransfer = done
      ? this.bankTransferEnum.BANK_TRANSFER_DONE
      : this.bankTransferEnum.BANK_ACCOUNT_ADDED;
    this.save().then(() => {
      history.push('/individual/manage');
    });
  };

  async save() {
    const { notification } = this.props;
    return new Promise((resolve) => {
      request({
        url: `/bundle/${this.state.bundle_id}`,
        method: 'put',
        data: {
          state: (this.bankTransfer === this.bankTransferEnum.BANK_TRANSFER_DONE) ? 1 : 0,
          virementBenefAdd: (this.bankTransfer === this.bankTransferEnum.BANK_ACCOUNT_ADDED),
          later: (this.state.paytype === '2'),
          feedback: this.state.feedback,
          present: this.state.present,
          present_email: this.state.present_email,
          present_message: this.state.present_message,
          present_date: (this.state.present) ? this.state.present_date : new Date(),
          present_name: this.state.present_name,
          present_firstname: this.state.present_firstname,
        },
      }, notification).then((res) => {
        resolve();
      });
    });
  }

  noAction = async () => {
    await this.save();
    const { history } = this.props;
    history.push('/individual/manage');
  };

  changeBundle() {
    const { notification } = this.props;
    request({
      url: `/bundle/${this.state.bundle_id}`,
      method: 'delete',
    }, notification).then((res) => {
      this.setState({ back: true });
    });
  }

  render() {
    const { t } = this.props;
    return (
      <div className="container py-4">
        <Meta title="Confirmation et paiement" />
        {(this.state.redirect) ? <Redirect to="/individual/end" paiement /> : null}
        {(this.state.back) ? <Redirect to="/individual/wish" /> : null}
        {(this.state.dash) ? <Redirect to="/individual/manage" /> : null}
        {(this.state.bundleState > 5) ? <Redirect to="/individual/manage" /> : null}
        <div className="row justify-content-center">
          <div className="col">
            <div className="progress">
              <div className="progress-bar" role="progressbar" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-11 col-md-10 col-sm-12">
            <h2 className="text-center my-4">Confirmation et paiement</h2>
            <p>
              {`Je parraine ${this.state.bees} abeilles d'une ruche sur laquelle sera marqué mon nom.
              Je recevrais ${this.state.bees / 10000 * 8} pots de miel de 250g produits par mes abeilles.
              De plus, une page internet sera dédiée à ma ruche et je pourrais y retrouver des actualités sur mes abeilles.`}
              <br />
              <strong>{`Le coût total est de ${this.state.price} euros par an.`}</strong>
              <br />
              <br />
              <Button onClick={this.changeBundle.bind(this)}>Changer d'offre</Button>
            </p>
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-10 col-sm-12">
                <h3 className="my-4">Adresse de facturation</h3>
                <ViewAddress data={this.state.billing_address} />
                <h3 className="my-4">Message</h3>
                <div className="form-group">
                  <textarea rows="5" className="form-control" name="feedback" onChange={handleChange.bind(this)} value={this.state.feedback} placeholder="Informations complémentaires concernant votre commande ou commentaires, laissez-nous un petit message, nous y prêterons grande attention :)" />
                </div>
              </div>
              <div className="col-lg-6 col-md-10 col-sm-12">
                <h3 className="my-4">Adresse de livraison</h3>
                <Address data={this.state.delivery_address} />
                <h3 className="mt-5">
Ce parrainage est un cadeau
                  {!this.state.present_ok && <input type="checkbox" name="present" checked={this.state.present} onChange={handleTick.bind(this)} />}
                </h3>
                {this.state.present
                  && (
                  <form>
                    <p>L’adresse de votre bénéficiaire est différente ? Merci de sélectionner « Adresse de livraison différente » et de remplir tous les champs.</p>
                    <div className="form-group">
                      <input type="text" className="form-control" value={this.state.present_name} name="present_name" onChange={handleChange.bind(this)} placeholder="Nom du bénéficiaire *" />
                    </div>
                    <div className="form-group">
                      <input type="text" className="form-control" value={this.state.present_firstname} name="present_firstname" onChange={handleChange.bind(this)} placeholder="Prénom du bénéficiaire *" />
                    </div>
                    <div className="form-group">
                      <input type="email" className="form-control" value={this.state.present_email} name="present_email" onChange={handleChange.bind(this)} placeholder="Email du bénéficiaire *" />
                    </div>
                    <div className="form-group">
                      <textarea className="form-control" value={this.state.present_message} name="present_message" onChange={handleChange.bind(this)} placeholder="Message personnalisé à joindre (optionnel)" />
                    </div>
                    <div className="form-group">
                      <label>Notifier l'heureux bénéficiaire à partir du :</label>
                      <DatePicker
                        dateFormat="DD/MM/YYYY"
                        selected={this.state.present_date}
                        onChange={this.handleDateChange}
                        className="form-control"
                      />
                    </div>
                  </form>
                  )
                }
              </div>
            </div>
            <h3 className="my-4">Paiement sécurisé</h3>
            <div className="row justify-content-center">
              <form className="col-lg-3 col-md-10 col-sm-12 my-4">
                <div className="form-group">
                  <div className="form-check">
                    <label className="form-check-label">
                      <input type="radio" className="form-check-input" name="paytype" value="0" onChange={handleChange.bind(this)} checked={(this.state.paytype === '0')} />
                      <span>Carte bancaire</span>
                    </label>
                  </div>
                  <div className="form-check">
                    <label className="form-check-label">
                      <input type="radio" className="form-check-input" name="paytype" value="1" onChange={handleChange.bind(this)} checked={(this.state.paytype === '1')} />
                      <span>Virement bancaire</span>
                    </label>
                  </div>
                  <div className="form-check">
                    <label className="form-check-label">
                      <input type="radio" className="form-check-input" name="paytype" value="2" onChange={handleChange.bind(this)} checked={(this.state.paytype === '2')} />
                      <span>Payer plus tard</span>
                    </label>
                  </div>
                </div>
              </form>
              <div className="col-lg-9 col-md-10 col-sm-12">
                {this.state.paytype === '0'
                  && (
                  <Elements locale="fr">
                    <PayForm price={this.state.price} nbBees={this.state.bees} before={this.save.bind(this)} bundle={this.state.bundle_id} date={(this.state.present_date) ? this.state.present_date : new Date()} for={`${this.state.firstname} ${this.state.name}`} endpoint="/individual/end" />
                  </Elements>
                  )
                }

                {this.state.paytype === '1'
                  && (
                  <div>
                    <p>{t('ourTransferInfo')}</p>
                    <p>
                      <strong>{t('domiciliation')}</strong>
                      {t('bankName')}
                      <br />
                      <strong>{t('IBAN')}</strong>
                      {t('IBANValue')}
                      <br />
                      <strong>{t('BIC')}</strong>
                      {t('BICValue')}
                      <br />
                      <br />
                      <strong>{`${t('billNumber')} ${this.state.bill_number}`}</strong>
                    </p>
                    <p>
                      {t('delay')}
                      <br />
                      {t('validationOnOurSide')}
                    </p>
                    <p>
                      <button onClick={this.setBankTransfer.bind(this, false)} className="btn btn-primary">Bénéficiaire ajouté</button>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <button onClick={this.setBankTransfer.bind(this, true)} className="btn btn-primary">Virement effectué</button>
                    </p>
                  </div>
                  )
                }
                {this.state.paytype === '2'
                  && (
                  <div>
                    <p>
                      Vous pouvez choisir de régler votre parrainage quand bon vous semble. En cliquant sur « Payer plus tard » vous serez redirigé vers votre tableau de bord.
                      Les fonctionnalités sont quelque peu bridées.
                      En effet, nous avons besoin de la confirmation de paiement pour attribuer une ruche aux abeilles que vous souhaitez parrainer ;
                      {' '}
                      <strong>
vous ne pouvez donc
                      pas encore consulter la page de la ruche.
                      </strong>
                    </p>
                    <p>N’oubliez pas que pour un parrainage effectué entre :</p>
                    <ul>
                      <li>Le 1er juillet et le 31 décembre, vous recevez le miel de vos abeilles à partir du mois de mai de l’année suivante.</li>
                      <li>Le 1er janvier et le 30 juin, vous recevez le miel de vos abeilles à partir du mois d’octobre.</li>
                    </ul>
                    <p>Bonne visite sur notre plateforme !</p>
                    <button onClick={this.noAction} className="btn btn-primary">Payer plus tard</button>
                  </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(withNotification(withTranslation('payment')(IndividualCheckout)));
