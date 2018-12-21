import React, { Component } from 'react'
import request from '../../../services/Net'
import NotificationSystem from 'react-notification-system'
import moment from 'moment';
import FontAwesome from 'react-fontawesome';


export default class CompanyManageBills extends Component {

	constructor(props) {
		super (props)
		
		this.state = {
			user : null,
			bills: []
		}
	}

	componentDidMount() {
		request({
			url: '/bill/mine',
			method: 'get'
		}, this.refs.notif).then((res) => {
			this.setState({
				bills: res
			})
		})
	}

	render () {
		return (
			<div>
				<NotificationSystem ref="notif" />
				<div className="row">
					<div className="col">
						<h2 className="text-center my-4">Mes factures</h2>
						<table className="table">
							<tbody>
								<tr><th>Numero</th><th>Montant</th><th>Date</th><th></th></tr>
								{this.state.bills.map((bill) => (
										<tr key={bill.id}><td>{bill.number}</td><td>{bill.price} €</td><td>{moment(bill.date).format('DD/MM/YYYY')}</td><td>{(bill.file)?<a href={process.env.REACT_APP_CONTENT_DOMAIN+'/bills/'+bill.file} target="_blank" rel="noopener noreferrer" download><FontAwesome name="cloud-download" /></a>:''}</td></tr>
									)
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		)
	}
}
