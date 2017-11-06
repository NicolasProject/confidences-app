import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import request from '../../services/Net';
import NotificationSystem from 'react-notification-system';
import {StripeProvider} from 'react-stripe-elements';
import Paiement from '../utils/Paiement';

export default class CompanyCheckout extends Component {

	constructor(props) {
		super(props);
		this.state = {
			billing_name: '',
			billing_firstname: '',
			billing_address1: 'Chargement des informations en cours',
			billing_address2: '',
			billing_zipcode: '',
			billing_city: '',
			redirect: false,
			hives: 0
		}
	}

	componentDidMount() {
		request({
			url : '/user/me',
			method : 'get'
		}, this.refs.notif)
		.then((res) => {
			this.setState({
				company_name: res.company_name,
				billing_name: res.name,
				billing_firstname: res.firstname,
				billing_address1: res.addresses[0].line1,
				billing_address2: res.addresses[0].line2,
				billing_zipcode: res.addresses[0].zipcode,
				billing_city: res.addresses[0].city,
				hives: res.bundles[0].hives,
				duplicate: true
			})
			request({
				url : '/address',
				method : 'post',
				data : {
					address1 : this.state.billing_address1,
					address2 : this.state.billing_address2,
					zipcode : this.state.billing_zipcode,
					city : this.state.billing_city,
					type : 2
				}
			}, this.refs.notif);
		});

	}

	proceed() {
		request({
			url : '/bundle',
			method : 'put',
			data : {
				paid: true
			}
		}, this.refs.notif)
		.then((res) => {
			this.setState({
				redirect: true
			});
		}).catch((err) => {

		});
	}

    render () {
        return (
			<div className="container py-4">
				<NotificationSystem ref="notif" />
				{(this.state.redirect)?<Redirect to="/account" />:null}
				<div className="row justify-content-center">
					<div className="col">
						<div className="progress">
							<div className="progress-bar" role="progressbar" style={{width: '100%'}}></div>
						</div>
					</div>
				</div>
				<div className="row justify-content-center">
					<div className="col-9">
						<h2 className="text-center my-4">Confirmation et paiement</h2>
						<p>
							Je parraine {this.state.hives} ruches qui seront marquées à nos couleurs et recevrais {this.state.hives * 80} pots de miel de 125g produit par mes abeilles.
							De plus, une page
							internet sera dédiée à notre entreprise et aux
							actions qu’elle mène en faveur de l’environnement.
							Des actualités de nos ruches y seront régulièrement
							postées et accessibles au grand public mais aussi à
							nos partenaires.
							<br /><br />
							Le coût total est de {this.state.hives * 395} euros par an.
						</p>
						<div className="row justify-content-center">
							<div className="col-6">
								<p className="lead">Adresse de facturation</p>
								<p>
									{this.state.company_name}<br />
									{this.state.billing_firstname} {this.state.billing_name}<br/>
								{this.state.billing_address1}<br/>
							{(this.state.billing_address2)?this.state.billing_address2+'<br />':''}
									{this.state.billing_zipcode} {this.state.billing_city}<br/>
								</p>
							</div>
							<div className="col-6">
								<p className="lead">Adresse de livraison</p>
								<input type="checkbox" name="duplicate" checked={this.state.duplicate} onChange={() => { this.setState({duplicate: !this.state.duplicate})}} /> L'adresse de livraison est identique à celle de facturation
							</div>
						</div>
						<p className="lead text-center">Paiement securise via Stripe</p>
							<div className="row justify-content-center">
								<form className="col-6">
									<div className="form-group">
										<div className="form-check">
											<label className="form-check-label">
												<input type="radio" className="form-check-input" name="optionsRadios" value="" checked />
												<span>Carte bancaire</span>
											</label>
										</div>
										<div className="form-check">
											<label className="form-check-label">
												<input type="radio" className="form-check-input" name="optionsRadios" value="" />
												<span>Carte bancaire (3 mensualites sans frais)</span>
											</label>
										</div>
										<div className="form-check">
											<label className="form-check-label">
												<input type="radio" className="form-check-input" name="optionsRadios" value="" />
												<span>Virement bancaire</span>
											</label>
										</div>
										<div className="form-check">
											<label className="form-check-label">
												<input type="radio" className="form-check-input" name="optionsRadios" value="" />
												<span>Valider et payer plus tard</span>
											</label>
										</div>
									</div>
								</form>
								<div className="col-6">
									<StripeProvider apiKey="pk_test_mLWoutIWlytgJmEvWuSL3xSB">
										<Paiement />
								    </StripeProvider>
								</div>
							</div>
						<p className="text-center">
							<button onClick={this.proceed.bind(this)} className="btn btn-primary">Valider et payer</button>
						</p>
					</div>
				</div>
			</div>
        );
    }
}
