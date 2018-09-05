import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import request from '../../services/Net';
import NotificationSystem from 'react-notification-system';
import { Elements } from 'react-stripe-elements';
import PayForm from '../utils/PayForm'
import { handleChange } from '../../services/FormService';
import ReactGA from 'react-ga';
import Meta from '../utils/Meta';
import Address from '../utils/Address/Address';
import ViewAddress from '../utils/Address/ViewAddress';
import moment from 'moment';
import Resume from './Checkout/Resume'

export default class CompanyCheckout extends Component {

	constructor(props) {
		super(props);
		ReactGA.pageview(this.props.location.pathname);
		this.state = {
			bill_number: '',
			redirect: false,
			hives: 0,
			products : [],
			paytype: '',
			price: 0,
			saved: false,
			dash: false,
			feedback: '',
			present_date: moment(),
			wish: false,
			different: false,
			bundle_id: null,
			delivery_address: {
				type: 2
			},
			company_name: null
		}
		this.bankTransfer = this.bankTransferEnum.NO_TRANSFER;
	}

	bankTransferEnum = Object.freeze({
		NO_TRANSFER: 0,
		BANK_ACCOUNT_ADDED: 1,
		BANK_TRANSFER_DONE: 2,
	});

	componentDidMount() {
		request({
			url : '/user/me',
			method : 'get'
		}, this.refs.notif)
		.then((res) => {
			this.setState({
				hives: res.bundles[0].hives,
				pots: res.bundles[0].pots,
				price: res.bundles[0].price,
				products: res.bundles[0].products,
				bundle_id: res.bundles[0].id,
				duplicate: true,
				different: res.bundles[0].addr_diff,
				feedback: res.bundles[0].feedback,
				user: res,
				company_name: res.company_name,
				bundleState: res.bundles[0].state
			});

			request({
				url: '/bill/bundle/'+res.bundles[0].id,
				method: 'get'
			}, this.refs.notif).then((res) => {
				this.setState({
					bill_number: res.number
				});
			});
			res.addresses.forEach((address) => {
				if (address.type === 1) {
					this.setState({ billing_address: address })
				}
				else if (address.type === 2) {
					this.setState({
						delivery_address: address,
						different: address.addr_diff
					})
				}
			})
		});
	}

	setBankTransfer = done => {
		this.bankTransfer = done ? this.bankTransferEnum.BANK_TRANSFER_DONE:this.bankTransferEnum.BANK_ACCOUNT_ADDED;

		this.save().then((res) => {
			this.setState({ redirect : true })
		});
	}

	async save() {
		return new Promise(resolve => {
			request({
			url: '/bundle/'+this.state.bundle_id,
			method: 'put',
			data : {
				state : (this.bankTransfer === this.bankTransferEnum.BANK_TRANSFER_DONE) ? 1:0,
				virementBenefAdd: (this.bankTransfer === this.bankTransferEnum.BANK_ACCOUNT_ADDED) ? true:false,
				later: (this.state.paytype === '2')?true:false,
				feedback: this.state.feedback,
				present: this.state.present,
				present_email: this.state.present_email,
				present_message: this.state.present_message,
				present_date: (this.state.present)?this.state.present_date:new Date(),
				present_name: this.state.present_name,
				present_firstname: this.state.present_firstname
			}
			}, this.refs.notif).then((res) => {
				resolve();
			})
		});
	}

	async noAction() {
		await this.save();
		await request({
			url: '/user/later',
			method: 'put'
		}, null).then( () => {
			this.setState({
				redirect: true
			})
		}).catch(e => {
			this.refs.notif.addNotification({
	      		message: 'Erreur de sauvegarde !',
	      		level: 'error'
  			});
		});
	}


	async saveFeedback() {
		return new Promise(resolve => {
			request({
				url: '/bundle/'+this.state.bundle_id,
				method: 'put',
				data: {
					feedback: this.state.feedback
				}
			}, this.refs.notif).then((res) => {
				resolve();
			})
		})
	}

	changeBundle = () => {
		request({
			url: '/bundle/'+this.state.bundle_id,
			method: 'delete'
		}, this.refs.notif).then((res) => {
			this.setState({ wish : true });
		})
	}

	changeAddress(e) {
			this.setState({
				different: e.target.checked
			}, () => {
				request({
					url: '/address/diff',
					method: 'PUT',
					data: this.state.delivery_address
				}, this.refs.notif).then((res) => {
					console.log('diff ok');
				})
			})
	}



	render () {
		return (
			<div className="container py-4">
				<Meta title="Validation et paiement"/>
				<NotificationSystem ref="notif" />
				{(this.state.redirect)?<Redirect to="/company/end" />:null}
				{(this.state.dash)?<Redirect to="/company/end" />:null}
				{(this.state.wish)?<Redirect to="/company/wish" />:null}
				{(this.state.bundleState > 5)?<Redirect to="/company/manage" />:null}
				<div className="row justify-content-center">
					<div className="col">
						<div className="progress">
							<div className="progress-bar" role="progressbar" style={{width: '100%'}}></div>
						</div>
					</div>
				</div>
				<div className="row justify-content-center">
					<div className="col-lg-11 col-md-10 col-sm-12">
						<h2 className="text-center my-4">Confirmation et paiement</h2>
						<Resume
							changeBundle={this.changeBundle}
							hives={this.state.hives}
							pots={this.state.pots}
							products={this.state.products}
							price={this.state.price} />
						<div className="row justify-content-center">
							<div className="col-lg-6 col-md-10 col-sm-12">
								<h3 className="my-4">Adresse de facturation</h3>
								<ViewAddress data={this.state.billing_address} company={true}/>
								<h3 className="my-4">Message</h3>
								<div className="form-group">
									<textarea rows="5" className="form-control" name="feedback" onChange={handleChange.bind(this)} value={this.state.feedback} placeholder="Informations complémentaires concernant votre commande ou commentaires, laissez-nous un petit message, nous y prêterons grande attention :)" />
								</div>
							</div>
							<div className="col-lg-6 col-md-10 col-sm-12">
								<h3 className="my-4">Adresse de livraison différente <input type="checkbox" name="different" checked={this.state.different} onChange={this.changeAddress.bind(this) }/></h3>
								{this.state.different &&
									<Address data={this.state.delivery_address} company={true}/>
								}
							</div>
						</div>
						<h3 className="my-4">Paiement sécurisé</h3>
						<div className="row justify-content-center">
							<form className="col-lg-3 col-md-10 col-sm-12 my-4">
								<div className="form-group">
									<div className="form-check">
										<label className="form-check-label">
											<input type="radio" className="form-check-input" name="paytype" value="0" onChange={handleChange.bind(this)} checked={(this.state.paytype === '0')?true:false} />
											<span>Carte bancaire</span>
										</label>
									</div>
									<div className="form-check">
										<label className="form-check-label">
											<input type="radio" className="form-check-input" name="paytype" value="1" onChange={handleChange.bind(this)} checked={(this.state.paytype === '1')?true:false} />
											<span>Virement bancaire</span>
										</label>
									</div>
									<div className="form-check">
										<label className="form-check-label">
											<input type="radio" className="form-check-input" name="paytype" value="2" onChange={handleChange.bind(this)} checked={(this.state.paytype === '2')?true:false} />
											<span>Payer plus tard</span>
										</label>
									</div>
								</div>
							</form>
							<div className="col-lg-9 col-md-10 col-sm-12">
								{this.state.paytype === '0' &&
									<Elements locale="fr">
										<PayForm price={this.state.price} before={this.save.bind(this)} bundle={this.state.bundle_id} date={(this.state.present_date)?this.state.present_date:new Date()} for={this.state.company_name} endpoint="/company/end" />
									</Elements>
								}
								{this.state.paytype === '1' &&
									<div>
										<p>Veuillez trouver nos coordonnées bancaires pour procéder au virement</p>
										<p>
											<strong>Domiciliation : </strong>QONTO - 92641 BOULOGNE-BILLANCOURT<br />
											<strong>IBAN : </strong>FR76 1679 8000 0100 0004 1298 259<br/>
											<strong>BIC : </strong>TRZOFR21XXX<br/><br />
											<strong>Numéro de facture à indiquer dans la référence du virement : </strong>{this.state.bill_number}
										</p>
										<p>
											Si	votre	banque	vous	impose	un	délai	concernant	l’ajout	d’un	nouveau	compte	bénéficiaire,	nous	vous
											invitons	à	sélectionner	«	Bénéficiaire ajouté	».	Un	mail	vous	conviant	à	confirmer	votre	virement	vous	sera
											alors	adressé	3	jours	plus	tard. <br />
											De	notre	côté,	la	validation	de	votre	virement	sera	faite	sous	48h.
										</p>
										<button onClick={this.setBankTransfer.bind(this, false)} className="btn btn-primary">Bénéficiaire ajouté</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
										<button onClick={this.setBankTransfer.bind(this, true)} className="btn btn-primary">Virement effectué</button>
									</div>
								}
								{this.state.paytype === '2' &&
									<div>
										<p>
											Vous pouvez choisir de régler votre parrainage quand bon vous semble. En cliquant
											sur « Payer plus tard » vous serez redirigé vers votre tableau de bord. Les
											fonctionnalités sont quelque peu bridées et <strong>votre page dédiée ne peut être
											publiquement consultée.</strong><br /><br />
										N’oubliez pas que pour un parrainage effectué entre :
										<ul><li>Le 1er juillet et le 31 décembre, vous recevez le miel de vos abeilles à partir du
											mois de mai de l’année suivante.</li>
										<li>Le 1er janvier et le 30 juin, vous recevez le miel de vos abeilles à partir du mois
											d’octobre.</li></ul>
										Bonne visite sur notre plateforme !
									</p>
									<button onClick={this.noAction.bind(this)} className="btn btn-primary">Payer plus tard</button>
								</div>
								}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
