import React, { Component } from 'react';
import request from '../services/Net';
import NotificationSystem from 'react-notification-system'
import Loading from './utils/Loading';
import ReactHtmlParser from 'react-html-parser'
import FontAwesome from 'react-fontawesome'
import ImgHive from '../assets/img/logo_ruche_entreprise.png';
import moment from 'moment';
import ReactGA from 'react-ga';
import Meta from './utils/Meta'

const config = require('../config.js')

export default class Hive extends Component {

	constructor(props) {
		super(props)
		this.state = {
			hive: null,
		}
		ReactGA.pageview(this.props.location.pathname);
	}

	componentDidMount() {
		request({
			url: '/hive/'+this.props.match.params.id,
			method: 'get'
		}, this.refs.notif).then((res) => {
			this.setState({
				hive : res
			})
		})
	}

	render() {
		return (
			<div className="container-fluid">
				<Meta title="La ruche"/>
				<NotificationSystem ref="notif" />
				{(this.state.hive)?
					<div>
						<h1 className="text-center my-4" style={{ fontFamily: "HighTo" , padding: "0.4em 2.5em", zIndex: '5', color: '#E49C00' }}>RUCHE {this.state.hive.name.toUpperCase()}</h1>
					<div className="row">
						<div className="col-lg-4 col-md-7 col-sm-12 pr-4">
							<div className="row">
								<div className="col-lg-7 px-5">
									<img className="img-fluid" src={(this.state.hive.imgs[0])?config.cdn_url+'/'+this.state.hive.imgs[0]:ImgHive} alt="Photo principale de la ruche" />
								</div>
								<div className="col-lg-5" style={{ backgroundColor: '#E49C00' , color: 'white', fontFamily: "HighTo", fontSize: '1.25em' }}>
									<h2 className="mt-4">LES PARRAINS</h2>
									<div style={{ width : '100%', height: '1px', backgroundColor: 'white'}} className="mb-4" ></div>
									{this.state.hive &&
										this.state.hive.parrains.map((user) => {
											return (
												<h3>{(user.company_name)?user.company_name:user.firstname+' '+user.name}</h3>
											)
										})}
								</div>
							</div>
							<h2 className="mt-5" style={{ fontFamily: "HighTo" }}>INFORMATIONS SUR LA RUCHE</h2>
							<div style={{ width : '100%', height: '1px', backgroundColor: 'black'}} className="mb-4" ></div>
							<p style={{ fontFamily: "HighTo", fontSize: '1.25em' }}>
								Aucune information sur cette ruche pour le moment
							</p>
							<div className="row">
								{this.state.hive.imgs.map((img) => {
									if (img === this.state.hive.imgs[0]) {
										return (null);
									} else {
										return (
											<div className="col-6">
												<img src={config.cdn_url+'/'+img} key={img} alt="Photo de la ruche" className="img-fluid mb-4"/>
											</div>
										)
									}
								})}
							</div>
						</div>
						<div className="col-lg-8 col-md-4 col-sm-12" style={{ fontFamily: "HighTo", fontSize: '1.25em' }}>
							<h2 className="text-center">ACTUALITÉS</h2>
							{(this.state.hive.news.length)?
								this.state.hive.news.map((actu) => {
									let date;
									if (actu.date) {
										date = new Date(actu.date);
									} else {
										date = new Date(actu.createdAt);
									}
									return (
										<div className="my-2 row">
											<div className="col-lg-2">
												<img className="img-fluid" src={config.cdn_url+'/'+actu.img} alt="Card image cap" />
											</div>
											<div className="col-lg-10">
												<h3>{actu.title}</h3>
												<p><small className="text-muted">{moment(date).format("DD/MM/YYYY")}</small></p>
												<p className="collapse" id={actu.id}>
													{ReactHtmlParser(actu.content)}
												</p>
												<button className="btn btn-link" data-toggle="collapse" data-target={'#'+actu.id}>Développer / Réduire <FontAwesome name='sort' /></button>
											</div>
										</div>
									)
								})
							:"Aucune actualité à afficher pour cette ruche"}
						</div>
					</div>
				</div>
				:<Loading />}
			</div>
		)
	}
}
