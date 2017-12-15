import React, { Component } from 'react';
import { CardNumberElement, CardExpiryElement, CardCVCElement } from 'react-stripe-elements';
import {injectStripe} from 'react-stripe-elements';
import request from '../../services/Net'
import NotificationSystem from 'react-notification-system'
import { Redirect } from 'react-router-dom'
import Loading from './Loading'

const config = require('../../config.js');

class PayForm extends Component {

	constructor(props) {
		super(props);
		this.state = {
			redirect: false,
			loading: false
		}
	}

	handleSubmit = (ev) => {
	ev.preventDefault();
	this.setState({
		loading: true
	})
	this.props.stripe.createSource({
		owner: {
			name: this.props.for
		},
		metadata : {
			bundle: this.props.bundle
		}
	}).then(({source}) => {
		request({
			url: '/payment/prepare',
			method: 'post',
			data: {
				source: source,
				redirect: config.app_url+this.props.endpoint
			}
		}, this.refs.notif).then((res) => {
			if (res) {
				window.location.replace(res.redirect.url);
			}
		}).catch((err) => {
			this.setState({
				loading: false
			})
		})
	}).catch((err) => {
		this.setState({
			loading: false
		})
	});
  }

	render () {
		return (
			<div>
				<NotificationSystem ref="notif" />
					<form onSubmit={this.handleSubmit} className="text-center" style={{ padding: '10px', margin: '10px'}} >
						<label>Numéro de carte bancaire</label>
						<CardNumberElement style={{ base: { fontSize: '18px' }}} />
						<label>Date d'expiration</label>
						<CardExpiryElement style={{ base: { fontSize: '18px' }}} />
						<label>Code de sécurité</label>
						<CardCVCElement style={{ base: { fontSize: '18px' }}} />
						{this.state.fail && <p className="alert alert-danger">Echec du paiement	</p>}
						{(this.state.loading)?
							<div className="text-center">
								<Loading />
								Paiement en cours
							</div>:
							<button className="btn btn-primary">Payer {this.props.price} €</button>
							}
						<p className="mt-4" style={{  border: 'solid 1px #00E676', backgroundColor: '#B9F6CA', padding: '10px', margin: '10px' }}>Les paiements sont réalisés via le système <strong>sécurisé</strong> Stripe qui utilise le <strong>protocole
						SSL</strong>. Les informations transmises sont <strong>cryptées</strong> et le paiement est compatible 3D
						Secure, MasterCard SecureCode, Verified by VISA.
						Dans un soucis de sécurité, Confidences d'Abeilles ne conserve pas vos
						informations bancaires.</p>
					</form>
			</div>
		)
	}
}

export default injectStripe(PayForm)
