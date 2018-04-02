import React, { Component } from 'react'
import NotificationSystem from 'react-notification-system'
import request from '../../../services/Net'
import ReactGA from 'react-ga';
import { Link } from 'react-router-dom'

import logoSquare from '../../../assets/img/logo-square.png';
import EtiD from '../../../assets/img/label/etiquette_defaut.jpg';
import EtiAi from '../../../assets/img/label/preview_AI.png';
import EtiIndd from '../../../assets/img/label/preview_INDD.png';
import EtiPdf from '../../../assets/img/label/preview_PDF.png';
import Eti1 from '../../../assets/img/label/sample_Etiquette_E1.jpg';
import Eti2 from '../../../assets/img/label/sample_Etiquette_E2.jpg'
import Eti3 from '../../../assets/img/label/sample_Etiquette_E3.jpg'
import Eti4 from '../../../assets/img/label/sample_Etiquette_E4.jpg'

const config = require('../../../config.js');

export default class CompanyManageCustomize extends Component {

	constructor(props) {
		super(props);
		ReactGA.pageview(this.props.location.pathname);
		this.state = {
			current: null,
			labelCurrent: null,
			label_format: '',
			label: ''
		}
	}

	componentDidMount() {
		request({
			url: '/user/me',
			method: 'get'
		}, this.refs.notif).then((res) => {
			console.log(res);
			request({
				url: '/bundle/owner/'+res.id,
				method: 'get'
			}, this.refs.notif).then((bund) => {
				this.setState({
					ownerId: res.id,
					bundleId: bund.id,
					label_format: bund.label_format,
					labelCurrent: bund.label
				})
				this.checkFormat();
				// let check = [];
				// check.append
			})
		});
	}

	upload(e) {
		e.preventDefault()
		const formData = new FormData();
		if (document.getElementById("label").files[0]) {
			formData.append('label', document.getElementById("label").files[0]);

		request({
			url : '/bundle/label/'+this.state.bundleId,
			method : 'put',
			data : formData,
			headers : {
				'content-type': 'multipart/form-data'
			}
		}, this.refs.notif).then( () => {
			console.log(document.getElementById("label").files[0]);
			request({
				url: '/bundle/owner/'+this.state.ownerId,
				method: 'get'
			}, this.refs.notif).then((bund) => {
				this.setState({
					label_format: bund.label_format,
					labelCurrent: bund.label,
					labelDefault: ''
				})
				this.checkFormat();
		})
	})
}
	}

	checkFormat(){
		if (!this.state.label_format.localeCompare("pdf")){
			this.setState({labelDefault: EtiPdf});
		} else if (!this.state.label_format.localeCompare("AI")) {
			this.setState({labelDefault: EtiAi});
		} else if (!this.state.label_format.localeCompare("INDD")) {
			this.setState({labelDefault: EtiIndd});
		} else if (!this.state.label_format.localeCompare("DEFAULT")) {
			this.setState({labelDefault: EtiD});
		} else {
			this.setState({labelDefault: null});
		}
	}


	// <div className="col">
	// 	<h2 className="text-center my-4"></h2>
	// 	{this.state.labelCurrent ?
	// 		<div style={{ height: '210px', maxWidth: '100%' }}>
	// 			<img  width="auto" height="150" src={this.state.labelDefault ? this.state.labelDefault: config.cdn_url+'/'+this.state.labelCurrent} alt="parrainage1" />
	// 		</div>
	// 	:null}
	// </div>

	render () {
		return (
			<div>
				<div className="row">
				<NotificationSystem ref="notif" />

			</div>
			<div className="row">
				<div className="col">
				<h2 className="text-center my-4">Personnaliser nos pots de miel</h2>
				</div>
			</div>
			<div className="row">
				<div className="col">
					<div className="row">
						<div className="col">
							<div className="card">
								<div className="card-block">
									<div>
										<h5 className="text-center my-4">Notre étiquette personnalisée</h5>
											<i className="card-text" style={{fontSize: '85%'}}>Une version « par défaut » est générée automatiquement. 3
											solutions sont à votre disposition pour la modifier.</i>
											<div className="col text-center">
												<img  width="auto" height="150" src={this.state.labelDefault ? this.state.labelDefault: config.cdn_url+'/'+this.state.labelCurrent} alt="parrainage1" />
											</div>
												rajouter le nom type de fichier uploader ou default
									</div>
							</div>
						</div>
						</div>
						</div>
						<br />
						<div className="row">
							<div className='col'>
								<div className="card">
									<div className="card-block">


						<h5 className="text-center my-4">Réalisation en interne</h5>
						<p style={{fontSize: '85%'}}>Téléchargez un modèle (format AI, INDD),
						Modifiez-le,
						Renvoyez-nous votre version !</p>
						<button className="btn btn-primary">
							Télécharger le modèle
						</button>
						<form onSubmit={this.upload.bind(this)} className="my-2">
							<div className="form-group">
								<div style={{fontSize: '85%'}}><label htmlFor="label" className={(this.state.label)?'active-upload':'upload'}>Glissez votre fichier ou cliquez pour en sélectionner un
								(formats acceptés : PDF, AI, INDD, PSD, PNG, JPG)<br/>
								⚠ ATTENTION ⚠ Assurez-vous que les dimensions de votre
								étiquette respectent bien 63,5x38,1mm, avec 1,5mm de fond
								perdu gauche/droite et 0,5mm haut/bas. -
								{(this.state.label)?'Selectionné : '+this.state.label:"Aucun fichier séléctionné"}</label>
								</div>
								<input type="file" className="form-control" id="label" onChange={() => { this.setState({ label : document.getElementById("label").files[0].name }) }} style={{display:'none'}}/>
							</div>
							<button className="btn btn-primary">Soumettre cette étiquette</button>
						</form>
					</div>
					</div>
					</div>
					</div>
				</div>
					<div className="col">
						<div className="card">
							<div className="card-block">
								<div className="row">
									<div className="col">
										<h5 className="text-center my-4">Éditeur en ligne</h5><br />
										<button className="btn btn-primary">Démarrer ?</button><br />
										<p className="text-center">Templates disponibles</p>
									</div>
								</div>
						<div className="row">
							<div className="col">
								<img  width="auto" height="90" src={Eti1} alt="parrainage1" />
							</div>
							<div className="col">
							<img  width="auto" height="90" src={Eti2} alt="parrainage2" />
							</div>
						</div>
						<div className="row">
							<div className="col">
							<img  width="auto" height="90" src={Eti3} alt="parrainage3" />
							</div>
							<div className="col">
							<img  width="auto" height="90" src={Eti4} alt="parrainage4" />
							</div>
						</div>
						<br />
							<p className="text-center">Ces templates sont proposés par Marine du Peloux.
							Vous avez une idée, vous voulez lui confier la
							réalisation de votre étiquette ? Contactez-la !</p>
						<br />
						<Link to="/requestlabel" className="btn btn-primary">
							Contacter une graphiste
						</Link>

				</div>
				</div>
				</div>
			</div>
		</div>
		)
	}
}
