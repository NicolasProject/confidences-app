import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import request from '../../services/Net';
import { handleChange } from '../../services/FormService';
import { isLoggedIn } from '../../services/AuthService';
import NotificationSystem from 'react-notification-system';

export default class IndividualAddress extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: false,
			message: '',
			address1: '',
			address2: '',
			address3: '',
			address4: '',
			city: '',
			zipcode: '',
			country: 'France'
		}
	}

	componentDidMount() {
		request({
			url: '/user/me',
			method: 'get'
		}, this.refs.notif).then((res) => {
			this.setState({
				address1 : res.name+' '+res.firstname
			})
		});
	}

	addAddress(e) {
		e.preventDefault();
		if (!this.state.address1 || !this.state.city || !this.state.zipcode) {
			this.refs.notificationSystem.addNotification({
				message: "Merci de renseigner tous les champs obligatoires",
				level: 'warning'
			});
		} else {
			request({
				url : '/address',
				method : 'post',
				data : {
					line1 : this.state.address1,
					line2 : this.state.address2,
					line3 : this.state.address3,
					line4 : this.state.address4,
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
						line1 : this.state.address1,
						line2 : this.state.address2,
						line3 : this.state.address3,
						line4 : this.state.address4,
						city : this.state.city,
						zipcode : this.state.zipcode,
						country: this.state.country,
						type : 2
					}
				}, this.refs.notif)
				.then((res) => {
					console.log("done");
					this.setState({
						redirect: true
					});
				})
			})
			.catch((err) => {});
		}
	}

    render () {
        return (
			<div className="container py-4">
				<NotificationSystem ref="notif" />
				{(isLoggedIn())?null:<Redirect to="/" />}
				{(this.state.redirect)?
					<Redirect to="/individual/wish" />
					:null}
				<div className="row justify-content-center">
					<div className="col">
						<div className="progress">
							<div className="progress-bar" role="progressbar" style={{width: '50%'}}></div>
						</div>
					</div>
				</div>
				<div className="row justify-content-center">
					<div className="col-6">
						<form className="text-center">
							<h2 className="text-center my-4">Votre adresse</h2>
							{(this.state.message)?
								<p className="alert alert-danger">{this.state.message}</p>
								:null}
							<div className="form-group">
								<input type="text" name="address1" className="form-control" placeholder="Nom et prénom *" value={this.state.address1} onChange={handleChange.bind(this)} />
							</div>
							<div className="form-group">
								<input type="text" name="address2" className="form-control" placeholder="Entreprise" value={this.state.address2} onChange={handleChange.bind(this)} />
							</div>
							<div className="form-group">
								<input type="text" name="address3" className="form-control" placeholder="Adresse ligne 1 *" value={this.state.address3} onChange={handleChange.bind(this)} />
							</div>
							<div className="form-group">
								<input type="text" name="address4" className="form-control" placeholder="Adresse ligne 2" value={this.state.address4} onChange={handleChange.bind(this)} />
							</div>
							<div className="form-group row">
								<div className="col-4">
								<input type="number" name="zipcode" className="form-control" placeholder="Code postal *" onChange={handleChange.bind(this)} />
								</div>
								<div className="col-8">
									<input type="text" name="city" className="form-control" placeholder="Ville *" onChange={handleChange.bind(this)} />
								</div>
							</div>
							<div className="form-group">
								<input type="text" name="country" className="form-control" placeholder="Pays *" value={this.state.country} onChange={handleChange.bind(this)} />
							</div>
							<input type="submit" className="btn btn-primary" value="Continuer" onClick={this.addAddress.bind(this)} />
						</form>
					</div>
				</div>
			</div>
        );
    }
}
