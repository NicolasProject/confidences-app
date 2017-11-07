import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import request from '../../services/Net';
import { handleChange } from '../../services/FormService';
import { isLoggedIn } from '../../services/AuthService';
import NotificationSystem from 'react-notification-system';

export default class CompanyAddress extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false,
			message: '',
			address1: '',
			address2: '',
			city: '',
			zipcode: '',
			country: 'France'
		}
	}

	addAddress(e) {
		e.preventDefault();
		if (!this.state.address1 || !this.state.city || !this.state.zipcode) {
			this.refs.notif.addNotification({
				message : "Merci de rendeigner tous les champs",
				level : 'warning'
			})
		} else {
			request({
				url : '/address',
				method: 'post',
				data : {
					address1 : this.state.address1,
					address2 : this.state.address2,
					city : this.state.city,
					zipcode : this.state.zipcode,
					country: this.state.country,
					type : 1
				}
			}, this.refs.notif)
			.then((res) => {
				request({
					url : '/address',
					method: 'post',
					data : {
						address1 : this.state.address1,
						address2 : this.state.address2,
						city : this.state.city,
						zipcode : this.state.zipcode,
						country: this.state.country,
						type : 2
					}
				}, this.refs.notif)
				.then((res) => {
					this.setState({
						redirect: true
					});
				})
			});
		}
	}

    render () {
        return (
			<div className="container py-4">
				<NotificationSystem ref="notif" />
				{(isLoggedIn())?null:<Redirect to="/" />}
				<div className="row justify-content-center">
					<div className="col">
						<div className="progress">
							<div className="progress-bar" role="progressbar" style={{width: '60%'}}></div>
						</div>
					</div>
				</div>
				<div className="row justify-content-center">
					<div className="col-6">
						<form className="text-center">
							<h2 className="text-center my-4">Adresse de l'entreprise</h2>
							{(this.state.message)?
								<p className="alert alert-danger">{this.state.message}</p>
								:null}
							<div className="form-group">
								<input type="text" name="address1" className="form-control" placeholder="Adresse ligne 1" onChange={handleChange.bind(this)} />
							</div>
							<div className="form-group">
								<input type="text" name="address2" className="form-control" placeholder="Adresse ligne 2" onChange={handleChange.bind(this)} />
							</div>
							<div className="form-group">
								<input type="text" name="city" className="form-control" placeholder="Ville" onChange={handleChange.bind(this)} />
							</div>
							<div className="form-group">
								<input type="number" name="zipcode" className="form-control" placeholder="Code postal" onChange={handleChange.bind(this)} />
							</div>
							<div className="form-group">
								<input type="text" name="country" className="form-control" placeholder="Pays" value={this.state.country} onChange={handleChange.bind(this)} />
							</div>
							<p>
								Remarque : merci de renseigner l’adresse de facturation de
								votre société. Si l’adresse de livraison n’est pas la même vous
								aurez toujours la possibilité de la modifier par la suite.
							</p>
							<input type="submit" className="btn btn-primary" value="Continuer" onClick={this.addAddress.bind(this)} />
						</form>
					</div>
				</div>
				{(this.state.redirect)?
					<Redirect to="/company/wish" />
				:null}
			</div>
        );
    }
}
