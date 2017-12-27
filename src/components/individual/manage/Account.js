import React, { Component } from 'react';
import request from '../../../services/Net'
import NotificationSystem from 'react-notification-system'
import Confirm from '../../utils/Confirm'
import { logout } from '../../../services/AuthService'
import { handleChange } from '../../../services/FormService'
import ReactGA from 'react-ga';
import FontAwesome from 'react-fontawesome'
import { Redirect } from 'react-router-dom'
export default class Account extends Component {

    constructor(props) {
        super(props)
        ReactGA.pageview(this.props.location.pathname);
        this.state = {
            sessions : null,
            logout: false
        }
    }

    deleteAccount() {
    	request({
    		url: '/user',
    		method: 'delete'
    	}, this.refs.notif).then((res) => {
    		logout();
    		this.setState({
    			logout: true
    		})
    	})
    }

    changePassword(e) {
		e.preventDefault()
		if (this.state.password === this.state.conf) {
			request({
				url: '/user',
				method: 'put',
				data: {
					password: this.state.password
				}
			}, this.refs.notif)
		} else {
			this.refs.notif.addNotification({
				message: 'Le nouveau mot de passe et sa confirmation ne correspondent pas',
				level: 'warning'
			})
		}
	}

    render () {
        return (
            <div className="row">
                {this.state.logout && <Redirect to="/" />}
                <NotificationSystem ref="notif" />
                <div className="col-lg-12">
                    <h2 className="text-center my-5">Mon compte</h2>
                    <div className="row">
                        <div className="col-lg-6 text-center">
                            <h3 className="text-center my-4"><small>Modifier mon mot de passe</small></h3>
                            <form onSubmit={this.changePassword.bind(this)}>
                                <div className="form-group">
                                    <input type="password" name="password" onChange={handleChange.bind(this)} value={this.state.password} className="form-control" placeholder="Nouveau mot de passe" />
                                </div>
                                <div className="form-group">
                                    <input type="password" name="conf" onChange={handleChange.bind(this)} value={this.state.conf} className="form-control" placeholder="Confirmation du nouveau mot de passe" />
                                </div>
                                <button className="btn btn-primary mb-4">Enregistrer</button>
                            </form>
                        </div>
                        <div className="col-lg-6 text-center">
                            <h3 className="text-center my-4"><small>Supprimer mon compte</small></h3>
                            <p className="alert alert-danger"><FontAwesome name="warning"/> Attention ! En vertu des restrictions en vigueur et par respect de vos données personnelles, l'intégralité des données de votre compte et de votre parrainage seront EFFACÉES. En supprimant votre compte, vous renoncez alors à tous droits sur ces derniers.</p>
                            <Confirm action={this.deleteAccount.bind(this)} text="Supprimer mon compte" class="btn btn-sm btn-danger"/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
