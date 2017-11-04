
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { handleChange } from '../../services/FormService';
import request from '../../services/Net';
import NotificationSystem from 'react-notification-system';

export default class ContributorLead extends Component {

	constructor(props) {
		super(props);
		this.state = {
			redirect : false,
			company_name: '',
			siren: '',
			contact: 0
		}
	}

	addLead(e) {
		e.preventDefault();
		if (this.state.contact !== 0 && this.state.company_name && this.state.siren) {
			request({
				url : '/lead',
				method: 'post',
				data : {
					company_name : this.state.company_name,
					siren : this.state.siren,
					contact: this.state.contact
				}
			}, this.refs.notif).then((res) => {
				this.setState({
					redirect : true
				})
			});
		} else {
			this.refs.notif.addNotification({
				message: 'Merci de remplir tous les champs',
				level: 'warning'
			})
		}
	}

	handleSiren(event) {
		const target = event.target;
	    const name = target.name;
	    const value = target.value.replace(/ /g,'');
	    this.setState({
	        [name]: value
	    });
	}

	render () {
		return (
			<div className="container py-4">
				<NotificationSystem ref="notif" />
				{(this.state.redirect)?
				<Redirect to="/contributor/leadok" />
				:null}
				<div className="row justify-content-center">
					<div className="col">
						<div className="progress">
							<div className="progress-bar" role="progressbar" style={{width: '66%'}}></div>
						</div>
					</div>
				</div>
				<div className="row justify-content-center">
					<div className="col-6">
						<form className="text-center">
							<h2 className="text-center my-4">Ajouter une entreprise</h2>
							<div className="form-group">
								<input type="text" name="company_name" className="form-control" placeholder="Raison sociale de l'entreprise" onChange={handleChange.bind(this)} />
							</div>
							<div className="form-group">
								<input type="text" name="siren" className="form-control" placeholder="Numero de SIREN" onChange={this.handleSiren.bind(this)} />
							</div>
							<div className="form-group">
								<select name="contact" onChange={handleChange.bind(this)} className="form-control">
									<option value="0" selected disabled>Type du premier contact</option>
									<option value="1">Téléphonique</option>
									<option value="2">Email</option>
									<option value="3">Rendez-vous</option>
									<option value="4">Discussion informelle</option>
									<option value="5">Autre</option>
								</select>
							</div>
							<input type="submit" className="btn btn-primary" value="Continuer" onClick={this.addLead.bind(this)} />
						</form>
					</div>
				</div>

			</div>
		);
	}
}
