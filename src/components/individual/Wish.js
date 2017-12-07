import React, { Component } from 'react';
import { handleChange } from '../../services/FormService';
import { isLoggedIn } from '../../services/AuthService';
import { Redirect } from 'react-router-dom';
import request from '../../services/Net'
import NotificationSystem from 'react-notification-system'

export default class IndividualWish extends Component {

	constructor(props) {
		super(props);
		this.state = {
			bees: 10000
		}
	}

	selectBundle(e) {
		e.preventDefault();
		request({
			url : '/bundle',
			method : 'post',
			data : {
				bees : this.state.bees
			}
		}, this.refs.notif)
		.then((res) => {
			this.setState({ redirect : true})
		})
	}

    render () {
        return (
			<div className="container py-4">
				<NotificationSystem ref="notif" />
				{(isLoggedIn())?null:<Redirect to="/" />}
				{(this.state.redirect)?
				<Redirect to="/individual/checkout" />
				:null}
				<div className="row justify-content-center">
					<div className="col">
						<div className="progress">
							<div className="progress-bar" role="progressbar" style={{width: '75%'}}></div>
						</div>
					</div>
				</div>
				<div className="row justify-content-center">
					<form className="col-6">
						<p className="text-center lead my-4">
							Je decide de parrainer
						</p>
						<div className="form-group">
							<select name="bees" className="form-control" onChange={handleChange.bind(this)}>
								<option value="10000">10 000 abeilles</option>
								<option value="20000">20 000 abeilles</option>
								<option value="30000">30 000 abeilles</option>
								<option value="40000">40 000 abeilles</option>
								<option value="50000">50 000 abeilles, soit une ruche complète</option>
							</select>
						</div>
						<ul>
							<li>Ce sont {this.state.bees} abeilles de plus qui viendront renforcer la population du rucher et participer à la préservation de la biodiversité.</li><br/>
							<li>Vous recevrez  {this.state.bees * 8 / 10000} pots de miel à votre nom et produits par les abeilles que vous parrainez.</li>
						</ul>
						<p className="text-center">
						<button onClick={this.selectBundle.bind(this)} className="btn btn-primary">Continuer</button>
						</p>
					</form>
				</div>
			</div>
        );
    }
}
