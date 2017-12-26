
import React,{ Component } from 'react';
import request from '../../../services/Net';
import NotificationSystem from 'react-notification-system'
import ReactGA from 'react-ga';

export default class ContributorManageApproaches extends Component {

	constructor(props) {
		super(props);
		ReactGA.pageview(this.props.location.pathname);
		this.state = {
			loading: true
		}
	}

	componentDidMount() {
		request({
			url : '/user/me',
			method : 'get'
		}, this.refs.notif).then((res) => {
			this.setState({ leads : res.leads, loading: false })
		});
	}

	render () {
		return (
			<div className="row">
				<NotificationSystem ref="notif" />
				{(this.state.loading)?'Chargement en cours...':
				<div className="col-12">
					<table className="table">
						<tbody>
							<tr>
								<th>Nom de l'entreprise</th><th>Statut</th>
							</tr>
							{this.state.leads.map((lead) => {
								var date = new Date(lead.createdAt);
								return (<tr><td>{lead.company_name}</td><td>{lead.converted?'Parrain':'Démarchée'}</td></tr>)
							})}
						</tbody>
					</table>
				</div>
				}
			</div>
		);
	}
}
