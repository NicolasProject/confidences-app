import React, { Component } from 'react'
import Loading from '../../../utils/Loading'
import request from '../../../../services/Net'
import NotificationSystem from 'react-notification-system'
import Payment from './tiles/Payment'
import Bills from './tiles/Bills'
import Parrains from './tiles/Parrains'
import Label from './tiles/Label'
import { Link } from 'react-router-dom'

export default class AdminManageBundleId extends Component {

	state = {
		bundle: null,
		parrain: null
	}

	componentDidMount() {
		request({
			url: '/bundle/'+this.props.match.params.id,
			method: 'get'
		}, this.refs.notif).then((res) => {
			this.setState({
				bundle: { ...res, state : res.state.toString() },
				owner: res.owner
			});
			console.log(res.owner);
		})
	}

	changeState = ( event ) => {
		this.setState({
			bundle: { ...this.state.bundle, state: parseInt(event.target.value, 10) }
		})
	}

	submitState = () => {
		request({
			url: '/bundle/'+this.state.bundle.id,
			method: 'put',
			data: {
				state : this.state.bundle.state
			}
		}, this.refs.notif).then((res) => {

		});
	}

	downloadLabel = () => {
		request({
			url: '/bundle/'+this.props.id+'/label',
			method: 'get'
		}, this.refs.notif);
	}

	render () {
		return (
			<div>
				<NotificationSystem ref="notif" />
				<ol className="breadcrumb">
					<li className="breadcrumb-item"><Link to="/admin/manage">Panel d'Administration</Link></li>
					<li className="breadcrumb-item"><Link to="/admin/manage/bundle">Parrainages</Link></li>
					<li className="breadcrumb-item active">Parrainage{(this.state.bundle)?' de '+this.state.bundle.owner.firstname+' '+this.state.bundle.owner.name:''}</li>
				</ol>
				{(this.state.bundle)?
				<div className="row">
					<div className="col-lg-6">
						<Payment state={this.state.bundle.state.toString()} changeState={this.changeState} submitState={this.submitState} />
						<Bills bundleId={this.state.bundle.id} />
						<Label downloadLabel={this.downloadLabel} />
					</div>
					<div className="col-lg-6">
						{this.state.owner.user_type === 2 ?<Parrains parrain={this.state.owner} bundleLabel={this.state.bundle.label}/>
						:null}
					</div>
				</div>
				:<Loading />}
			</div>
		)
	}
}
