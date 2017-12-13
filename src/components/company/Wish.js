import React, { Component } from 'react';
import { handleChange } from '../../services/FormService';
import request from '../../services/Net';
import { Redirect } from 'react-router-dom';
import NotificationSystem from 'react-notification-system';

export default class CompanyWish extends Component {

	constructor(props) {
		super(props);
		this.state = {
			hives: 0,
			redirect: false
		}
	}

	createBundle(e) {
		e.preventDefault()
		if (this.state.hives > 0 && this.state.hives < 100)
		{
			request({
				url : '/bundle',
				method : 'post',
				data : {
					hives : this.state.hives
				}
			}, this.refs.notif)
			.then((res) => {
				this.setState({ redirect : true})
			})
			.catch((err) => {
			});
		} else {
			this.refs.notif.addNotification({
				level : 'error',
				message : 'Modifiez dans la première affirmation le nombre de ruches que vous souhaitez parrainer'
			})
		}
	}

	componentDidUpdate() {
		if (this.state.hives > 99)
		{
			this.setState({ hives : 0 })
		}
	}

    render () {
        return (
			<div className="container py-4">
				<NotificationSystem ref="notif" />
				{(this.state.redirect)?<Redirect to="/company/checkout" />:null}
				<div className="row justify-content-center">
					<div className="col">
						<div className="progress">
							<div className="progress-bar" role="progressbar" style={{width: '80%'}}></div>
						</div>
					</div>
				</div>
				<div className="row justify-content-center">
					<form className="col-lg-6 col-md-10 col-sm-12" onSubmit={this.createBundle.bind(this)}>
						<p className="text-center lead my-4">Nous parrainons <input type="number" min="0" max="99" placeholder={this.state.hives} name="hives" style={{ borderWidth : '0 0 1px 0', width: '2em', margin: '1em', fontSize: '2em' }} onChange={handleChange.bind(this)} /> ruche(s)</p>
						<ul>
							<li>Cela représente plus de {this.state.hives * 50000} abeilles supplémentaires pour prendre soin de la biodiversité</li>
							<li>C’est aussi l’équivalent de {this.state.hives * 80} pots de miel par an</li>
						</ul>
						<p className="text-center">
						<button  className="btn btn-primary">Continuer</button>
						</p>
					</form>
				</div>
			</div>
        );
    }
}
