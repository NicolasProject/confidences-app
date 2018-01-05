import React, { Component } from 'react'
import request from '../../services/Net'
import NotificationSystem from 'react-notification-system'
import { Redirect } from 'react-router-dom'
import FooterPage from './FooterPage'
import ReactHtmlParser from 'react-html-parser'
import FontAwesome from 'react-fontawesome'
import imgPlaceholder from '../../assets/img/profile.png';
import { Link } from 'react-router-dom'
import ReactGA from 'react-ga';
import Meta from '../utils/Meta'

const defaultImg = require("../../assets/img/profile.png")
const config = require('../../config.js');

export default class CompanyPage extends Component {

	constructor(props) {
		super (props)
		ReactGA.pageview(this.props.location.pathname);
		this.state = {
			user : null,
			hives: [],
			news: [],
			redirect : false
		}
	}

	componentDidMount() {
		request({
			url : 'users/namespace/'+this.props.match.params.namespace,
			method : 'get'
		}, this.refs.notif).then((res) => {
			if (res.visible) {
				this.setState({
					user : res
				})
				request({
					url : '/hive/bundle/'+res.bundles[0].id,
					method: 'get'
				}, this.refs.notif).then((res) => {
					this.setState({
						hives: res
					})
				})
			} else {
				this.setState({
					redirect: true
				})
			}
		}).catch((err) => {
			this.setState({
				redirect: true
			})
		})
	}

    render () {
        return (
			<div>
	            <div className="container">
					<Meta title="Page entreprise"/>
					{(this.state.redirect)?<Redirect to="/" />:null}
					<NotificationSystem ref="notif" />
					<div className="row justify-content-center">
						<h1 style={{ backgroundColor : "#E49C00", color: 'white', padding: "0.5em 5em"}}>{(this.state.user)?this.state.user.company_name:null}</h1>
						<div className="col-lg-12">
							{(this.state.user && this.state.user.cover)?<img src={(this.state.user)?config.cdn_url+'/'+this.state.user.cover:null} alt="Cover" className="img-fluid" />:null}
						</div>
					</div>
				</div>
				<div className="container-fluid">
					<div className="row">
						<div style={{ width : '100%', height: '1em', backgroundColor: '#E49C00'}}>
						</div>
					</div>
				</div>
				<div className="container">
					<div className="row">
						<div className="col-lg-6 col-md-12">
							<div className="row align-items-center py-4">
								<div className="col-4 logo mr-4">
								</div>
								<div className="col">
									<div className="card">
			  							<div className="card-block">
											{(this.state.user && this.state.user.description)?this.state.user.description:"Cette entreprise n'a pas encore rédigé sa description"}
										</div>
									</div>
								</div>
							</div>
							<img src={(this.state.user && this.state.user.logo)?config.cdn_url+'/'+this.state.user.logo:defaultImg} alt="Logo entreprise" />
							<div className="row align-items-center mb-4">
								{(this.state.user && this.state.user.link1_url && this.state.user.link1_name)?
								<div className="col text-center">
									<a className="btn btn-secondary" target="_blank" href={(this.state.user)?this.state.user.link1_url:null}>{(this.state.user)?this.state.user.link1_name:null}</a>
								</div>:null}
								{(this.state.user && this.state.user.link2_url && this.state.user.link2_name)?
								<div className="col text-center">
									<a className="btn btn-secondary" target="_blank" href={(this.state.user)?this.state.user.link2_url:null}>{(this.state.user)?this.state.user.link2_name:null}</a>
								</div>:null}
							</div>
							{(this.state.user && this.state.user.involvement)?
								<div className="row justify-content-center">
									<div className="col">
										<h2 className="text-center">Notre engagement pour la biodiversité</h2>
										<p className="m-4">
											{this.state.user.involvement}
										</p>
									</div>
								</div>
							:''}
						</div>
						<div className="col-lg-6 col-md-10 col-sm-12">
							<h2 className="text-center my-4">Les ruches que nous parrainons</h2>
							<div className="row">
								{this.state.hives.map((hive) => {
									return (
										<div className="card w-25 m-3">
											<img className="card-img-top img-fluid" src={imgPlaceholder} alt="Card image cap" />
											<div className="card-block">
												<h3 className="card-title">{hive.name}</h3>
												<Link to={'/hive/'+hive.id} className="btn">Voir en détails</Link>
											</div>
										</div>
									)
								})}
							</div>
							<h2 className="text-center my-4">Les dernières actualités</h2>
									{this.state.user && this.state.user.news.map((actu) => {
										const date = new Date(actu.createdAt);
										return (
											<div className="card my-2 flex-row">
												<div className="card-block col-2">
													<img className="img-fluid" src={config.cdn_url+'/'+actu.img} alt="Card image cap" />
												</div>
												<div className="card-block col-10">
													<h3 className="card-title">{actu.title}</h3>
													<p className="card-text collapse" id={actu.id}>
														{ReactHtmlParser(actu.content)}
													</p>
													<button className="btn btn-link" data-toggle="collapse" data-target={'#'+actu.id}>Développer / Réduire <FontAwesome name='sort' /></button>
													<p className="card-text"><small className="text-muted">{date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear()}</small></p>
												</div>
											</div>
										)
									})}
						</div>
					</div>
					<FooterPage />
	            </div>
			</div>
        );
    }
}
