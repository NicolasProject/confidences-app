import React, { Component } from 'react'
import Loading from '../../../utils/Loading'
import request from '../../../../services/Net'
import NotificationSystem from 'react-notification-system'
import Payment from './Tiles/Payment'
import Bills from './Tiles/Bills'
import Parrains from './Tiles/Parrains'
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
			bundle: { ...this.state.bundle, state: parseInt(event.target.value) }
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

	render () {
		return (
			<div>
				<Link className="btn btn-info btn-sm" to="/admin/manage/bundle"> {'<'} Retour aux parrainages</Link>
				<NotificationSystem ref="notif" />
				<h2 className="text-center my-2">Parrainage{(this.state.bundle)?' de '+this.state.bundle.owner.firstname+' '+this.state.bundle.owner.name:''}</h2>
				{(this.state.bundle)?
				<div className="row">
					<div className="col-lg-6">
						<Payment state={this.state.bundle.state.toString()} changeState={this.changeState} submitState={this.submitState} />
						<Bills bundleId={this.state.bundle.id} />
					</div>
					<div className="col-lg-6">
						{this.state.owner.user_type == 2 ?<Parrains parrain={this.state.owner} bundleLabel={this.state.bundle.label}/>
						:null}
					</div>
				</div>
				:<Loading />}
			</div>
		)
	}
}
