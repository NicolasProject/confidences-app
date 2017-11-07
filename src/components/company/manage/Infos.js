
import React, { Component } from 'react'
import request from '../../../services/Net'
import NotificationSystem from 'react-notification-system'
import { handleChange } from '../../../services/FormService'

export default class CompanyManageInfos extends Component {

	constructor(props) {
		super(props)
		this.state = {

		}
	}

	componentDidMount() {
		this.get();
	}

	get() {
		request({
			url : '/user/me',
			method : 'get',
		}, this.refs.notif).then((res) => {
			this.setState({ user : res });
			res.addresses.map((address) => {
				if (address.type === 1) {
					this.setState({
						bid: address.id,
						baddress1: address.line1,
						baddress2: address.line2,
						bzip: address.zipcode,
						bcity: address.city,
						bcountry: address.country
					})
				}
				if (address.type === 2) {
					this.setState({
						did: address.id,
						daddress1: address.line1,
						daddress2: address.line2,
						dzip: address.zipcode,
						dcity: address.city,
						dcountry: address.country
					})
				}
			})
		});
	}

	updateBaddress(e) {
		e.preventDefault();
		request({
			url: '/address/'+this.state.bid,
			method: 'put',
			data : {
				line1: this.state.baddress1,
				line2: this.state.baddress2,
				zipcode: this.state.bzip,
				city: this.state.bcity,
				country: this.state.bcountry
			}
		}, this.refs.notif);
	}

	updateDaddress(e) {
		e.preventDefault();
		request({
			url: '/address/'+this.state.did,
			method: 'put',
			data : {
				line1: this.state.daddress1,
				line2: this.state.daddress2,
				zipcode: this.state.dzip,
				city: this.state.dcity,
				country: this.state.dcountry
			}
		}, this.refs.notif);
	}

	render () {
		return (
			<div>
				<NotificationSystem ref="notif" />
				<div className="row my-2">
					<div className="col">
						<h2 className="text-center">
							Mes informations
						</h2>
					</div>
				</div>
					<div className="row">
						{(this.state.user)?
						<div className="col">
							<h3 className="text-center">Mon entreprise</h3>
							<h4>{this.state.user.company_name}</h4>
							<p>
								<strong>SIREN :</strong> {this.state.user.siren}<br />
							</p>
						</div>
						:'Chargement en cours...'}
						{(this.state.user)?
						<div className="col">
							<h3 className="text-center">Mes informations personnelles</h3>
							<p>
								<strong>Nom :</strong> {this.state.user.name}<br />
								<strong>Prénom :</strong> {this.state.user.firstname}<br />
								<strong>Poste dans l'entreprise :</strong> {this.state.user.job}<br />
								<strong>Numéro de téléphone :</strong> {this.state.user.phone}<br />
							</p>
						</div>
						:null}
					</div>
					<div className="row">
						{this.state.user &&
						<form className="col-6">
							<h3 className="text-center">Mon adresse de facturation</h3>
							<div className="form-group">
								<input type="text" name="baddress1" onChange={handleChange.bind(this)} value={this.state.baddress1} className="form-control" placeholder="Adresse ligne 1 *"/>
							</div>
							<div className="form-group">
								<input type="text" name="baddress2" onChange={handleChange.bind(this)} value={this.state.baddress2} className="form-control" placeholder="Adresse ligne 2"/>
							</div>
							<div className="form-group row">
								<div className="col-4">
									<input type="text" name="bzip" onChange={handleChange.bind(this)} value={this.state.bzip} className="form-control" placeholder="Code postal"/>
								</div>
								<div className="col-8">
									<input type="text" name="bcity" onChange={handleChange.bind(this)} value={this.state.bcity} className="form-control" placeholder="Ville *"/>
								</div>
							</div>
							<div className="form-group">
								<input type="text" name="bcountry" onChange={handleChange.bind(this)} value={this.state.bcountry} className="form-control" placeholder="Pays / Etat *"/>
							</div>
							<div className="form-group">
								<button className="btn btn-primary" onClick={this.updateBaddress.bind(this)}>Enregistrer les modifications</button>
							</div>
						</form>
						}
						{this.state.user &&
						<form className="col-6">
							<h3 className="text-center">Mon adresse de livraison</h3>
							<div className="form-group">
								<input type="text" name="daddress1" onChange={handleChange.bind(this)} value={this.state.daddress1} className="form-control" placeholder="Adresse ligne 1 *"/>
							</div>
							<div className="form-group">
								<input type="text" name="daddress2" onChange={handleChange.bind(this)} value={this.state.daddress2} className="form-control" placeholder="Adresse ligne 2"/>
							</div>
							<div className="form-group row">
								<div className="col-4">
									<input type="text" name="dzip" onChange={handleChange.bind(this)} value={this.state.dzip} className="form-control" placeholder="Code postal *"/>
								</div>
								<div className="col-8">
									<input type="text" name="dcity" onChange={handleChange.bind(this)} value={this.state.dcity} className="form-control" placeholder="Ville *"/>
								</div>
							</div>
							<div className="form-group">
								<input type="text" name="dcountry" onChange={handleChange.bind(this)} value={this.state.dcountry} className="form-control" placeholder="Pays / Etat *"/>
							</div>
							<div className="form-group">
								<button className="btn btn-primary" onClick={this.updateDaddress.bind(this)}>Enregistrer les modifications</button>
							</div>
						</form>
						}
					</div>
			</div>
		);
	}
}
