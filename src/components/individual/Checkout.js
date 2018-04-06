import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import request from '../../services/Net';
import { handleChange, handleTick } from '../../services/FormService'
import NotificationSystem from 'react-notification-system'
import { Elements } from 'react-stripe-elements';
import PayForm from '../utils/PayForm'
import DatePicker from 'react-datepicker';
import moment from 'moment';
import ReactGA from 'react-ga';
import 'react-datepicker/dist/react-datepicker.css';
import Meta from '../utils/Meta';
import Address from '../utils/Address/Address';
import ViewAddress from '../utils/Address/ViewAddress';

export default class IndividualCheckout extends Component {

	constructor(props) {
		super(props);
		ReactGA.pageview(this.props.location.pathname);
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
			different: false,
			present: false,
			present_date: moment(),
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
			firstname: ''
		}
	}

	componentDidMount() {
		request({
			url : '/user/me',
			method : 'get'
		}, this.refs.notif)
		.then((res) => {
			this.setState({
				name: res.name,
				firstname: res.firstname,
				bees: res.bundles[0].bees,
				price: res.bundles[0].price,
				bundle_id: res.bundles[0].id,
				duplicate: true,
				feedback: res.bundles[0].feedback
			});
			request({
				url: '/bill/bundle/'+res.bundles[0].id,
				method: 'get'
			}, this.refs.notif).then((res) => {
				this.setState({
					bill_number: res.number
				});
			});
				res.addresses.map((address) => {
					if (address.type == 1) {
						this.setState({ billing_address: address })
					}
					if (address.type == 2) {
						this.setState({ delivery_address: address })
					}
				})
		});
	}

	handleDateChange(date) {
		this.setState({
			present_date: date
		});
	}

	async setWaitingPayment() {
		await this.save();
		request({
			url: '/bundle/'+this.state.bundle_id,
			method: 'put',
			data : {
				state: 1,
				present_end: new Date(new Date(this.state.present_date).setFullYear(new Date().getFullYear() + 1))
			}
		}, this.refs.notif).then((res) => {
			this.setState({ redirect : true })
		})
	}

	async save() {
		return new Promise(async resolve => {
			await this.saveFeedback();
			if (this.state.different) {

			}
			await this.handlePresent();
			resolve();
		})
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

	async noAction() {
		await this.save();
		await request({
			url: '/user/later',
			method: 'put'
		}, this.refs.notif);
		this.setState({
			redirect: true
		})

	}

	async saveDaddress() {
		return new Promise(resolve => {
			if (!this.state.dsexe_m || !this.state.daddress3 || !this.state.dcity || !this.state.dzip) {
				this.refs.notif.addNotification({
					message : "Merci de renseigner tous les champs de votre adresse de livraison",
					level : 'warning'
				})
			} else {
				if (this.state.dphone.length > 9) {
					request({
						url: '/address/'+this.state.did,
						method: 'put',
						data: {
							sexe_m : (this.state.dsexe_m === '0')?false:true,
							line1: this.state.daddress1,
							line3: this.state.daddress3,
							line4: this.state.daddress4,
							zipcode: this.state.dzip,
							city: this.state.dcity,
							country: this.state.dcountry,
							phone: this.state.dphone,
							addr_diff: true
						}
					}, this.refs.notif).then((res) => {
						resolve();
					})
				} else {
					this.refs.notif.addNotification({
						message: 'Merci de renseigner un numero de telephone valide pour la livraison',
						level: 'warning'
					})
				}
			}
		});
	}

	changeBundle() {
		request({
			url: '/bundle/'+this.state.bundle_id,
			method: 'delete'
		}, this.refs.notif). then((res) => {
			this.setState({ back : true });
		})
	}

	async handlePresent() {
		return new Promise(resolve => {
			request({
				url: '/bundle/'+this.state.bundle_id,
				method: 'put',
				data : {
					present: this.state.present,
					present_email: this.state.present_email,
					present_message: this.state.present_message,
					present_date: (this.state.present_date)?this.state.present_date:new Date(),
					present_name: this.state.present_name,
					present_firstname: this.state.present_firstname
				}
			}, this.refs.notif).then((res) => {
				resolve();
			})
		});
	}

    render () {
        return (
			<div className="container py-4">
				<Meta title="Confirmation et paiement"/>
				<NotificationSystem ref="notif" />
				{(this.state.redirect)?<Redirect to="/individual/end" paiement={true}/>:null}
				{(this.state.back)?<Redirect to="/individual/wish" />:null}
				{(this.state.dash)?<Redirect to="/individual/manage" />:null}
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
						<p>
							Je parraine {this.state.bees} abeilles d'une ruche sur laquelle sera marqué mon nom.
							Je recevrais {this.state.bees / 10000 * 8} pots de miel de 250g produits par mes abeilles.
							De plus, une page internet sera dédiée à ma ruche et je pourrais y retrouver des actualités sur mes abeilles.
							<br /><br />
							<strong>Le coût total est de {this.state.price} euros par an.</strong><br /><br />
							<button className="btn btn-primary" onClick={this.changeBundle.bind(this)}>Changer d'offre</button>
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
								<h3 className="my-4">Adresse de livraison différente {!this.state.saved && <input type="checkbox" name="different" checked={this.state.different} onChange={handleTick.bind(this) }/>}</h3>
								{this.state.different && !this.state.saved &&
									<Address data={this.state.delivery_address} />
								}
								<h3 className="mt-5">Ce parrainage est un cadeau {!this.state.present_ok && <input type="checkbox" name="present" checked={this.state.present} onChange={handleTick.bind(this) }/>}</h3>
								{this.state.present &&
										<form>
										<p>L’adresse de votre bénéficiaire est différente ? Merci de sélectionner « Adresse de livraison différente » et de remplir tous les champs.</p>
										<div className="form-group">
											<input type="text" className="form-control" name="present_name" onChange={handleChange.bind(this)} placeholder="Nom du bénéficiaire *" />
										</div>
										<div className="form-group">
											<input type="text" className="form-control" name="present_firstname" onChange={handleChange.bind(this)} placeholder="Prénom du bénéficiaire *" />
										</div>
										<div className="form-group">
											<input type="email" className="form-control" name="present_email" onChange={handleChange.bind(this)} placeholder="Email du bénéficiaire *" />
										</div>
										<div className="form-group">
											<textarea className="form-control" name="present_message" onChange={handleChange.bind(this)} placeholder="Message personnalisé à joindre (optionnel)" />
										</div>
										<div className="form-group">
											<label>Notifier l'heureux bénéficiaire à partir du :</label>
											<DatePicker
												dateFormat="DD/MM/YYYY"
										        selected={this.state.present_date}
										        onChange={this.handleDateChange.bind(this)}
												className="form-control"
											    />
										</div>
									</form>
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
										<PayForm price={this.state.price} before={this.save.bind(this)} bundle={this.state.bundle_id} for={this.state.firstname+' '+this.state.name} endpoint="/individual/end" />
									</Elements>
								}

								{this.state.paytype === '1' &&
									<div>
										<p>Veuillez trouver nos coordonnées bancaires pour procéder au virement</p>
										<p>
											<strong>Domiciliation : </strong>OLKYPAY GRENOBLE<br />
											<strong>IBAN : </strong>FR36 1973 3000 01LU 3121 1050 436<br/>
											<strong>BIC : </strong>OPSPFR21OKL<br/><br />
											<strong>Numéro de facture à indiquer dans la référence du virement : </strong>{this.state.bill_number}
										</p>
										<p>S’il ne vous est pas possible de procéder de suite au virement nous vous invitions à
										choisir l’option « Payer plus tard » et à ajouter Confidences d’Abeilles comme un
										nouveau bénéficiaire sur votre compte. Une fois le bénéficiaire ajouté et le
										virement réalisé, vous serrez invité à revenir sur cette page et à confirmer votre
										virement.
										De notre côté, la validation prend entre 2 et 3 jours. Un mail vous informera de la
										bonne prise en compte de votre parrainage.</p>
										<button onClick={this.setWaitingPayment.bind(this)} className="btn btn-primary">Virement effectué</button>
									</div>
								}

								{this.state.paytype === '2' &&
									<div>
										<p>
											Vous pouvez choisir de régler votre parrainage quand bon vous semble. En cliquant sur « Payer plus tard » vous serez redirigé vers votre tableau de bord. Les fonctionnalités sont quelque peu bridées.
											En effet, nous avons besoin de la confirmation de paiement pour attribuer une ruche aux abeilles que vous souhaitez parrainer ; <strong>vous ne pouvez donc pas encore consulter la page de la ruche.</strong><br /><br />
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
