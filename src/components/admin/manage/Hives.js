import React, { Component } from 'react'
import request from '../../../services/Net'
import NotificationSystem from 'react-notification-system'
import { handleChange } from '../../../services/FormService'
import ReactQuill from 'react-quill'
import Loading from '../../utils/Loading'
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Confirm from '../../utils/Confirm';
import SquareImg from '../../utils/SquareImg';
import Feedback from '../../utils/Feedback';
import ReactGA from 'react-ga';
import ReactStars from 'react-stars';
import 'react-datepicker/dist/react-datepicker.css';
import imgPlaceholder from '../../../assets/img/logo_ruche_entreprise.png';
const config = require('../../../config.js');

export default class AdminManageHives extends Component {

	constructor(props) {
		super(props)
		ReactGA.pageview(this.props.location.pathname);
		this.state = {
			hives : null,
			new: '',
			selected: '',
			actu: '',
			actuTitle: '',
			actuDate: '',
			ratio: 0,
			stateFeedback: 0,
			feedback: ''
		}
	}

	componentDidMount() {
		this.get();
	}

	handleDateChange(date) {
		this.setState({
			actuDate: date
		});
	}

	get() {
		request({
			url: '/hive',
			method: 'get'
		}, this.refs.notif).then((res) => {
			this.setState({
				hives: res
			})
		})
	}

	addHive(e) {
		e.preventDefault();
		request({
			url: '/hive',
			method: 'post',
			data: {
				name: this.state.new
			}
		}, this.refs.notif).then((res) => {
			this.get();
			this.setState({
				new: ''
			})
		})
	}

	delete(id) {
		request({
			url: '/hive/'+id,
			method: 'delete'
		}, this.refs.notif).then((res) => {
			this.get();
		})
	}

	createActu(e) {
		e.preventDefault();
		const data = new FormData();
		data.append('content', this.state.actu);
		data.append('title', this.state.actuTitle);
		data.append('date', this.state.actuDate);
		if (document.getElementById("actu-img").files[0]) {
			data.append('img', document.getElementById('actu-img').files[0]);
		}
		request({
			url: '/news/hive/'+this.state.selected.id,
			method: 'post',
			data: data,
			header: {
				'content-type' : 'multipart/form-data'
			}
		}, this.refs.notif).then((res) => {
			this.setState({
				actuTitle: '',
				actu: '',
				actuDate: ''
			})
		})
	}

	updateActu(e) {
		e.preventDefault();
		const data = new FormData();
		data.append('content', this.state.actuModify);
		data.append('title', this.state.actuModifyTitle);
		data.append('date', this.state.actuModifyDate);
		if (document.getElementById("actu-modify-img").files[0]) {
			data.append('img', document.getElementById('actu-modify-img').files[0]);
		}
		request({
			url: '/news/'+this.state.newsModify,
			method: 'put',
			data: data
		}, this.refs.notif).then((res) => {
			this.get();
			this.setState({
				selected: ''
			})
		});
	}

	deleteActu() {
		request({
			url: '/news/'+this.state.newsModify,
			method: 'delete'
		}, this.refs.notif).then((res) => {
			this.get();
			this.setState({
				selected: ''
			})
		})
	}

	addPhoto(e) {
		e.preventDefault()
		const data = new FormData();
		data.append('id', this.state.selected.id);
		if (document.getElementById("hive-img").files[0]) {
			data.append("img", document.getElementById("hive-img").files[0]);
			request({
				url: '/hive/photo',
				method: 'post',
				data: data,
				header: {
					'content-type' : 'multipart/form-data'
				}
			}, this.refs.notif)
		}
	}

	launchModify(e) {
		e.preventDefault();
		this.setState({
			newsModify: e.target.value
		})

		request({
			url: '/news/'+e.target.value,
			method: 'get'
		}, this.refs.notif).then((res) => {
			this.setState({
				actuModifyTitle: res.title,
				actuModify: res.content,
				actuModifyDate : res.date
			})
		})
	}

	ratingChanged(e){
	  console.log(e);
		request({
			url: '/hive/ratio',
			method: 'POST',
			data : {
				id: this.state.selected.id,
				ratio: e
			}
		}, this.refs.notif).then((res) => {
			console.log('ratio update');
		})
	}

	saveFeedback(e) {
		console.log(e);
		e.preventDefault();
		request({
			url: 'hive/feedback',
			method: 'POST',
			data : {
				id: this.state.selected.id,
				feedback: this.state.feedback
			}
		}, this.refs.notif).then((res) => {
			this.setState({
				stateFeedback: 0
			})
			console.log('feedback update');
		})
	}

	saveInformation(e) {
		console.log(this.state.info);
		e.preventDefault();
		request({
			url: 'hive/information',
			method: 'POST',
			data : {
				id: this.state.selected.id,
				information: this.state.info
			}
		}, this.refs.notif).then((res) => {
			console.log('info update');
		})
	}

	updateFeedback(event) {
		let objState = {};
		objState[event.target.name] = event.target.value;
		this.setState(objState);
		this.setState({
			stateFeedback: 1
		})
	}

	changeImg(e) {

		console.log(e);
		request({
			url: 'hive/img/'+this.state.selected.id,
			method: 'PUT',
			data : {
				img: e
			}
		}, this.refs.notif).then((res) => {
			console.log("tout se passe bien ?");
		})
	}

	render () {
		return (
			<div>
				<div className="row">
					<NotificationSystem ref="notif" />
					<div className="col">
						<h2 className="text-center my-4">Gérer les ruches</h2>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-4">
						<h3>Créer une ruche</h3>
						<form className="form-inline my-3" onSubmit={this.addHive.bind(this)}>
							<input type="text" className="form-control mx-2" name="new" value={this.state.new} placeholder="Nom commun de la nouvelle ruche" onChange={handleChange.bind(this)} />
							<button type="submit" className="btn btn-primary">Créer la ruche</button>
						</form>
						<div style={{ maxHeight: '50vh', overflowY : 'scroll' }}>
							{this.state.hives?
							<table className="table">
								<tbody>
									<tr><th>Nom</th><th>Occupation</th><th></th></tr>
									{this.state.hives && this.state.hives.map((hive) => {
										return (
											<tr className={(this.state.selected.id === hive.id)?'table-info':''}>
												<td>{hive.name}</td><td>{hive.occupation} %</td>
												<td>
													<button className="btn btn-link btn-sm" onClick={() => {
														this.setState({
															selected : hive,
															ratio : hive.ratio,
															feedback: hive.feedback,
															stateFeedback: 0,
															imgsHive: hive.imgs,
															info: hive.info
														}, this.get());
														}} >Gérer</button>
												</td>
											</tr>
										)
									})}
								</tbody>
							</table>
							:<Loading />}
						</div>
					</div>
					{(this.state.selected)?

					<div className="col-lg-8">
						<h3 className="my-4">Noter cette ruche</h3>
							<ReactStars
								count={5}
								value={this.state.ratio}
								onChange={this.ratingChanged.bind(this)}
  							size={24}
							  color2={'#ffd700'} />
						<div className="form-group">
						<h3 className="my-4">Mémo technique sur la ruche</h3>
									<textarea rows="5" className="form-control" name="feedback" onChange={this.updateFeedback.bind(this)} value={this.state.feedback} placeholder="Informations complémentaires concernant la ruche" />
									{this.state.stateFeedback ? <button onClick={this.saveFeedback.bind(this)} className="btn btn-primary btn-sm mt-2">Sauvegarder</button>
									:null}
						</div>
						<div className="form-group">
							<h3 className="my-4">Information générale sur la ruche</h3>
							<textarea rows="5" className="form-control" name="info" onChange={handleChange.bind(this)} value={this.state.info} placeholder="Informations générale concernant la ruche" />
							<button onClick={this.saveInformation.bind(this)} className="btn btn-primary btn-sm mt-2">Sauvegarder</button>

						</div>
						<Feedback name={this.state.newsModify?this.state.newsModify:null} hiveId={this.state.selected.id}/>

						{this.state.selected.news ?
						<div>
							<h3 className="my-4">Modifier une news</h3>
							<select className="form-control" onChange={this.launchModify.bind(this)} name="newsModify">
								<option selected disabled>News a modifier</option>
								{this.state.selected.news.map((actu) => {
									const date = (actu.date)?moment(actu.date):moment(actu.createdAt);
									return (
										<option value={actu.id}>{actu.title} ( {date.format("DD/MM/YYYY")} )</option>
									)
								})}
							</select>
						</div>
						:null}
						<h3 className="py-4">Ajouter des photos</h3>
						<form onSubmit={this.addPhoto.bind(this)}>
							<div className="form-group">
								<label htmlFor="hive-img" className={(this.state.hiveImg)?'active-upload':'upload'} style={{ position: 'relative' }}>
									<input type="file" className="form-control" id="hive-img" onChange={() => { this.setState({ hiveImg : document.getElementById("hive-img").files[0].name }) }} style={{ position: 'absolute', height: '5.5em', top: '0', left: "0", opacity: '0.0001'}}/>
									Glisser une image ou cliquez pour en séléctionner un parmi vos fichiers<br/>
									Taille recommandée : 400x300 - {(this.state.hiveImg)?'Selectionné : '+this.state.hiveImg:"Aucun fichier séléctionné"}
								</label>
							</div>
							<button className="btn btn-primary">Ajouter cette photo</button>
						</form>
					</div>
					:<div className="col"></div>}
					{this.state.selected?
						<div>
							<div className="row justify-content-center">
							{this.state.imgsHive.map((img) => {
								return(
									<div className="col-4">
										<img  onClick={() => {this.changeImg(img)}} width="auto" height="120" src={(img)?config.cdn_url+'/'+img:imgPlaceholder} alt={img} />
									</div>
								)
							})}
					</div>
					</div>
					:null}
				</div>
			</div>
		)
	}
}
