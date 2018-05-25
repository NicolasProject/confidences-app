import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { handleChange } from '../../services/FormService';
import  request from '../../services/Net';
import NotificationSystem from 'react-notification-system';
import ReactGA from 'react-ga';
import Meta from '../utils/Meta'

export default class CompanyIdentity extends Component {

	constructor(props) {
		super(props);
		ReactGA.pageview(this.props.location.pathname);
		this.state = {
			company_name: '',
			siret: '',
			job: '',
			website: '',
			namespace: '',
			redirect : false
		}
	}

	handlesiret(event) {
		const target = event.target;
	    const name = target.name;
	    const value = target.value.replace(/ /g,'');
	    this.setState({
	        [name]: value
	    });
	}

	identify(e) {
		e.preventDefault();
		if (!this.state.company_name || !this.state.siret || !this.state.job) {
			this.refs.notif.addNotification({
				message: "Merci de renseigner tous les champs",
				level: 'warning'
			})
		} else {
			request({
				url : '/user',
				method : 'put',
				data : {
					company_name : this.state.company_name,
					siret : this.state.siret,
					namespace:this.state.namespace,
					job : this.state.job,
					website : this.state.website
				}}, this.refs.notif)
				.then((res) => {
					this.setState({
						redirect : true
					})
				})
				.catch((err) => {});
		}
	}

	replaceNamespace(e) {
		e.preventDefault();
		this.setState({
			[e.target.name]: e.target.value
		});
		const val = e.target.value;
		let TabSpec = {"à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","è":"e","é":"e","ê":"e","ë":"e","ç":"c","ì":"i","í":"i","î":"i","ï":"i","ù":"u","ú":"u","û":"u","ü":"u","ÿ":"y","ñ":"n","_":" "};
		let reg=/[àáäâèéêëçìíîïòóôõöøùúûüÿñ_]/gi;
		this.setState({
			fakeNamespace: e.target.value,
			namespace: (val.replace(reg,function(){ return TabSpec[arguments[0].toLowerCase()];}).toLowerCase()).replace(/\W+/g, '-')
		})
	}
	
    render () {
        return (
			<div className="container py-4">
				<Meta title="L'entreprise"/>
				<NotificationSystem ref="notif" />
				{(this.state.redirect)?<Redirect to="/company/address" />:null}
 				<div className="row justify-content-center">
					<div className="col">
						<div className="progress">
							<div className="progress-bar" role="progressbar" style={{width: '40%'}}></div>
						</div>
					</div>
				</div>
				<div className="row justify-content-center">
					<div className="col-lg-6 col-md-10 col-sm-12">
						<form className="text-center">
							<h2 className="text-center my-4">Information sur l'entreprise</h2>
							<div className="form-group">
								<input type="text" className="form-control" name="company_name" placeholder="Raison sociale *" onChange={this.replaceNamespace.bind(this)} />
							</div>
							<div className="form-group">
								<label htmlFor="namespace">URL par défaut de votre future page. Vous pourrez la modifier par la suite.</label>
								<div className="input-group">
									<span className="input-group-addon" id="basic-addon3">https://parrainagederuches.fr/parrains/</span>
									<input type="text" className="form-control" id="namespace" value={this.state.namespace} disabled />
								</div>
							</div>
							<div className="form-group">
								<input type="text" className="form-control" name="siret" placeholder="Numéro SIRET *" onChange={this.handlesiret.bind(this)} />
							</div>
							<div className="text-center">
								<a href="https://www.societe.com/" rel="noopener noreferrer" target="_blank">Trouver mon SIRET</a>
							</div>
							<br/>
							<div className="form-group">
								<input type="text" className="form-control" name="job" placeholder="Votre position *" onChange={handleChange.bind(this)} />
								<small id="emailHelp" className="form-text text-muted">Cela nous permet d'être plus pertinents dans notre communication</small>
							</div>
							<div className="form-group">
								<input type="text" className="form-control" name="website" placeholder="Site internet" onChange={handleChange.bind(this)} />
							</div>
							<div className="form-group">
								<label>* champs obligatoires</label>
							</div>
							<button onClick={this.identify.bind(this)} className="btn btn-primary">Continuer</button>
						</form>
					</div>
				</div>
			</div>
        );
    }
}
