import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import request from '../../services/Net';
import NotificationSystem from 'react-notification-system';

export default class ContributorCheckout extends Component {

	constructor(props) {
		super(props);
		this.state = {
		}
	}

	componenentDidMount() {
	}

	proceed() {
		request({
			url : '/contract',
			method : 'put',
			data : {
				signed : true
			}
		}, this.refs.notif).then((res) => {
			this.setState({ redirect : true });
		}).catch((err) => {})
	}

    render () {
        return (
			<div className="container py-4">
				<NotificationSystem ref="notif" />
				{(this.state.redirect)?<Redirect to="/contributor/manage" />:null}
				<div className="row justify-content-center">
					<div className="col">
						<div className="progress">
							<div className="progress-bar" role="progressbar" style={{width: '100%'}}></div>
						</div>
					</div>
				</div>
				<div className="row justify-content-center">
					<div className="col-6">
						<h2 className="text-center my-4">Validation et signature électronique du contrat</h2>
						<p>

						</p>

						<p className="text-center">
							<button onClick={this.proceed.bind(this)} className="btn btn-primary">Signer le contrat</button>
						</p>
					</div>
				</div>
			</div>
        );
    }
}
