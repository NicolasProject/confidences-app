import React, { Component } from 'react';
import { handleChange } from '../../services/FormService';
import { request } from '../../services/NetService';
import { isLoggedIn } from '../../services/AuthService';
import { Redirect } from 'react-router-dom';

export default class IndividualWish extends Component {

	constructor(props) {
		super(props);
		this.state = {
			bees: 10000
		}
	}

	selectBundle() {
		request('/user/bundle/create', 'POST', JSON.stringify(this.state), 'json', (status, message,content) => {
			if (status)
			{
				this.setState({
					redirect: true
				});
			}
		});
	}

    render () {
        return (
			<div className="container py-4">
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
					<div className="col-6">
						<p className="text-center lead my-4">
							Je decide de parrainer<br />
						<select name="bees" onChange={handleChange.bind(this)}>
								<option value="10000">10 000 abeilles</option>
								<option value="20000">20 000 abeilles</option>
								<option value="30000">30 000 abeilles</option>
								<option value="40000">40 000 abeilles</option>
							</select>
						</p>

						<ul>
							<li>CCe sont {this.state.bees} abeilles de plus qui viendront renforcer la population du rucher et participer à la préservation de la biodiversité.</li>
							<li>C'est aussi {this.state.bees * 8 / 10000} pots de miel produits par vos abeilles que vous recevrez !</li>
						</ul>
						<p className="text-center">
						<button onClick={this.selectBundle.bind(this)}>Continuer</button>
						</p>
					</div>
				</div>
			</div>
        );
    }
}
