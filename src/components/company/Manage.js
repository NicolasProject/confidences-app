import React, { Component } from 'react';
import request from '../../services/Net';
import CompanyManageDashboard from './manage/Dashboard';
import CompanyManageInfos from './manage/Infos';
import CompanyManageMyPage from './manage/MyPage';
import CompanyManageBills from './manage/Bills'
import CompanyManageCustomize from './manage/Customize'
import {
	Route,
	Link,
	Redirect
} from 'react-router-dom';
import NotificationSystem from 'react-notification-system';
import imgPlaceholder from '../../assets/img/img-placeholder.gif';
import Meta from '../utils/Meta'

const config = require('../../config.js');

export default class CompanyManage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			redirect: false,
			user : null
		}
	}

	componentDidMount() {
		request({
			url : '/user/me',
			method : 'get'
		}, this.refs.notif)
		.then((res) => {
			this.setState({
				user : res
			});
		})
		.catch((err) => {});
	}

	checkInfos() {
		if (!this.state.user.company_name) {
			return (<Redirect to="/company/identity" />);
		}
		if (this.state.user.addresses && !this.state.user.addresses[0]) {
			return (<Redirect to="/company/address" />);
		}
		if (this.state.user && this.state.user.bundles[0] && this.state.user.bundles[0].state === 0 ) {
			return (
				<p className="alert alert-danger mt-4">Vous n'avez pas encore reglé votre parrainage. <Link to="/company/checkout">Cliquez ici</Link> pour le faire maintenant</p>
			);
		}

		if (this.state.user && this.state.user.bundles[0] && this.state.user.bundles[0].state === 1 ) {
			return (
				<p className="alert alert-warning mt-4">La validation du règlement de votre parrainage est en cours</p>
			);
		}

		if (this.state.user && !this.state.user.bundles[0]) {
			return (<Redirect to="/company/wish" />);
		}
	}

	render () {
		return (
				<div className="container py-4">
					<Meta title="Mon espace personnel"/>
					<NotificationSystem ref="notif" />
					<div className="row">
						<div className="col-lg-3 col-md-4 col-sm-12">
							<div style={{ height: '210px', maxWidth: '100%', flexDirection: 'column'}} className="d-flex justify-content-center align-items-center">
								<img src={(this.state.user)?config.cdn_url+'/'+this.state.user.logo:imgPlaceholder} alt="Logo entreprise" style={{ maxWidth: '100%', maxHeight: '100%'}} />
							</div>
							<ul className="list-group">
								<li className="list-group-item"><Link to="/company/manage">Mon parrainage</Link></li>
								<li className="list-group-item"><Link to="/company/manage/infos">Mes informations</Link></li>
								<li className="list-group-item"><Link to="/company/manage/mypage">Ma page dediee</Link></li>
								<li className="list-group-item"><Link to="/company/manage/customize">Personnalisation</Link></li>
								<li className="list-group-item"><Link to="/company/manage/bills">Mes factures</Link></li>
								<li className="list-group-item"><Link to="/logout">Deconnexion</Link></li>
							</ul>
						</div>
						<div className="col-lg-9 col-md-8 col-sm-12">
							<div className="row">
								<div className="col-12">
									{(this.state.user)?this.checkInfos():''}
								</div>
							</div>
							<div className="row">
								<div className="col-12">
									<Route exact path="/company/manage" component={CompanyManageDashboard} />
									<Route exact path="/company/manage/infos" component={CompanyManageInfos} />
									<Route exact path="/company/manage/mypage" component={CompanyManageMyPage} />
									<Route exact path="/company/manage/customize" component={CompanyManageCustomize} />
									<Route exact path="/company/manage/bills" component={CompanyManageBills} />
								</div>
							</div>
						</div>
					</div>
				</div>
		);
	}
}
