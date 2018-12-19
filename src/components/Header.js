import React, { Component } from 'react';
import logoSquare from '../assets/img/logo-square.png';
import { NavLink, Link, Redirect } from 'react-router-dom';
import { isLoggedIn } from '../services/AuthService';
import FontAwesome from 'react-fontawesome'
import { handleChange } from '../services/FormService'
import request from '../services/Net';
import NotificationSystem from 'react-notification-system'

export default class Header extends Component {

	constructor(props) {
		super(props);
		this.state = {
			redirect : false,
			banner: (localStorage.getItem('hide'))?false:true,
			email: '',
			firstname: '',
			newsletter : false
		}
	}

	hide = () => {
		localStorage.setItem("hide", true);
	}

	subNewsletter = (e) => {
		e.preventDefault();
		request({
			url: '/newsletter',
			method: 'post',
			data: {
				firstname: this.state.firstname,
				email: this.state.email,
				listId: '17334'
			}
		}, this.refs.notif).then((res) => {
			this.refs.newsmodal.style.display = 'none';
			this.refs.newsmodal.classList.remove("show");
			this.setState({
				email: '',
				firstname: ''
			});
		})
	}

	newsletterPopup = () => (
		<div className="modal fade" id="newsmodal" data-backdrop={false} ref="newsmodal">
			<div className="modal-dialog" role="document">
				<form className="modal-content" onSubmit={this.subNewsletter} >
					<div className="modal-header">
						<h5 className="modal-title">S'abonner à la newsletter</h5>
						<button type="button" className="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div className="modal-body">
						<div className="form-group">
							<input type="text" name="firstname" value={this.state.firstname} className="form-control" onChange={handleChange.bind(this)} placeholder="Votre prénom..." />
						</div>
						<div className="form-group">
							<input type="email" name="email" value={this.state.email} className="form-control" onChange={handleChange.bind(this)} placeholder="Votre adresse email..." />
						</div>
					</div>
					<div className="modal-footer">
						<input type="submit" className="btn btn-secondary" value="Valider" />
					</div>
				</form>
			</div>
		</div>
	)

	render () {
		return (
			<div>
				<NotificationSystem ref="notif" />
				{this.state.banner &&
				<div style={{ width: '100%', height: 'auto', backgroundColor: '#424242', color: 'white', lineHeight: '3em', textAlign: 'center' }}>
					&nbsp;&nbsp;Ceci est la première version de la plateforme. Si vous rencontrez des difficultés au cours de son utilisation, <Link to="/contact">contactez nous</Link> ! <button className="btn btn-link" onClick={() => { this.setState({ banner: false }); this.hide(); }}>Fermer</button>
				</div>}
				<nav className="navbar navbar-toggleable-md navbar-light" style={{ boxShadow: '0 2px 2px silver' }}>
					<button className="navbar-toggler navbar-toggler-right align-self-center" type="button" data-toggle="collapse" data-target="#navbarNav">
						<span className="navbar-toggler-icon"></span>
					</button>
					{(this.state.redirect)?<Redirect to="/" />:null}
					<Link className="navbar-brand" to="/">
						<img src={logoSquare} width="auto" height="64" alt="Logo Confidences d'Abeilles" />
						<h2 className="badge badge-danger" style={{ position: 'absolute', top: '75px', left: '75px', fontSize: '1.5em', zIndex: 1000 }}>{(process.env.NODE_ENV === "development")?'Bêta':null}</h2>
					</Link>
					<div className="hidden-lg-up collapse" style={{justifyContent: 'space-between'}} id="navbarNav" onClick={() => { document.getElementById("navbarNav").classList.remove("show") }}>
						{(isLoggedIn())?
							<ul className="navbar-nav">
								<div className="dropdown-divider"></div>
							</ul>
							:
							<ul className="navbar-nav">
								<li className="nav-item">
									<Link className="nav-link" to="/company/presentation">Entreprise</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/individual/presentation">Particulier</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/partners">Partenaires</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/prices">Tarifs</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/hives">Les ruches</Link>
								</li>
								<div className="dropdown-divider"></div>
							</ul>
						}
						{(isLoggedIn())?
							<ul className="navbar-nav">
								<li className="nav-item">
									<Link className="nav-link" to="/about">Notre histoire</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/ourvalues">Nos valeurs</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/team">L'équipe</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/contact">Contact</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/jobs">Jobs</Link>
								</li>
								<li className="nav-item">
									<a className="nav-link" href="https://confidencesdabeilles.fr/" target="_blank" rel="noopener noreferrer">Boutique <FontAwesome name="external-link" /></a>
								</li>
								<li className="nav-item">
									<a className="nav-link" href="https://confidencesdabeilles.fr/blog" target="_blank" rel="noopener noreferrer">Blog <FontAwesome name="external-link" /></a>
								</li>
								<div className="dropdown-divider"></div>
								<li className="nav-item">
									<Link className="nav-link" to="/account">Mon compte</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/logout">Deconnexion</Link>
								</li>
							</ul>
							:
							<ul className="navbar-nav">
								<li className="nav-item">
									<strong className="nav-link"
										style={{ cursor : 'pointer' }}
										data-toggle="modal" data-target="#newsmodal">
										<FontAwesome name="envelope-o" /> Newsletter
									</strong>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/about">Notre histoire</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/ourvalues">Nos valeurs</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/team">L'équipe</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/contact">Contact</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/jobs">Jobs</Link>
								</li>
								<li className="nav-item">
									<a className="nav-link" href="https://confidencesdabeilles.fr/" target="_blank" rel="noopener noreferrer">Boutique <FontAwesome name="external-link" /></a>
								</li>
								<li className="nav-item">
									<a className="nav-link" href="https://confidencesdabeilles.fr/blog" target="_blank" rel="noopener noreferrer">Blog <FontAwesome name="external-link" /></a>
								</li>
								<div className="dropdown-divider"></div>
								<li className="nav-item">
									<Link className="nav-link" to="/login">Se connecter</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/presignup">Créer un compte</Link>
								</li>
							</ul>
						}
			</div>
				{(isLoggedIn())?
					<ul className="navbar-nav hidden-md-down">

					</ul>
					:
					<ul className="navbar-nav hidden-md-down">
						<li className="nav-item">
							<NavLink className="nav-link" to="/company/presentation" activeStyle={{backgroundColor: 'rgb(230,230,230)',
							boxShadow: '0px 0px 5px 2px rgb(230,230,230)'}}>Entreprise</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/individual/presentation" activeStyle={{backgroundColor: 'rgb(230,230,230)',
							boxShadow: '0px 0px 5px 2px rgb(230,230,230)'}}>Particulier</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/partners" activeStyle={{backgroundColor: 'rgb(230,230,230)',
							boxShadow: '0px 0px 5px 2px rgb(230,230,230)'}}>Partenaires</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/prices" activeStyle={{backgroundColor: 'rgb(230,230,230)',
							boxShadow: '0px 0px 5px 2px rgb(230,230,230)'}}>Tarifs</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/hives" activeStyle={{backgroundColor: 'rgb(230,230,230)',
							boxShadow: '0px 0px 5px 2px rgb(230,230,230)'}}>Les ruches</NavLink>
						</li>
					</ul>
				}
				{(isLoggedIn())?
					<ul className="navbar-nav ml-auto hidden-md-down">
						<li className="nav-item dropdown">
							<a className="nav-link dropdown-toggle" style={{ cursor : 'pointer' }} href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								La société
							</a>
							<div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
								<Link className="dropdown-item" to="/about">Notre histoire</Link>
								<Link className="dropdown-item" to="/ourvalues">Nos valeurs</Link>
								<Link className="dropdown-item" to="/team">L'équipe</Link>
								<Link className="dropdown-item" to="/contact">Contact</Link>
								<Link className="dropdown-item" to="/jobs">Jobs</Link>
								<a className="dropdown-item" href="https://confidencesdabeilles.fr/" target="_blank" rel="noopener noreferrer">Boutique <FontAwesome name="external-link" /></a>
								<a className="dropdown-item" href="https://confidencesdabeilles.fr/blog" target="_blank" rel="noopener noreferrer">Blog <FontAwesome name="external-link" /></a>
							</div>
						</li>
						<li className="nav-item">
							&nbsp;&nbsp;<Link className="btn btn-primary" to="/account">Mon compte</Link>
					</li>
					<li className="nav-item">
						&nbsp;&nbsp;<Link className="btn btn-primary" to="/logout">Deconnexion</Link>
				</li>
			</ul>
			:
			<ul className="navbar-nav ml-auto hidden-md-down">
				<li className="nav-item">
					<strong className="nav-link"
						style={{ cursor : 'pointer' }}
						data-toggle="modal" data-target="#newsmodal">
						<FontAwesome name="envelope-o" /> Newsletter
					</strong>
				</li>
				<li className="nav-item dropdown">
					<span className="nav-link dropdown-toggle" style={{ cursor : 'pointer' }} id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						La société
					</span>
					<div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
						<Link className="dropdown-item" to="/about">Notre histoire</Link>
						<Link className="dropdown-item" to="/ourvalues">Nos valeurs</Link>
						<Link className="dropdown-item" to="/team">L'équipe</Link>
						<Link className="dropdown-item" to="/contact">Contact</Link>
						<Link className="dropdown-item" to="/jobs">Jobs</Link>
						<a className="dropdown-item" href="https://confidencesdabeilles.fr/" target="_blank" rel="noopener noreferrer">Boutique <FontAwesome name="external-link" /></a>
						<a className="dropdown-item" href="https://confidencesdabeilles.fr/blog" target="_blank" rel="noopener noreferrer">Blog <FontAwesome name="external-link" /></a>
					</div>
				</li>

				<li className="nav-item">
					&nbsp;&nbsp;<Link className="btn btn-primary" to="/login">Se connecter</Link>
				</li>
				<li className="nav-item">
					&nbsp;&nbsp;<Link className="btn btn-primary" to="/presignup">Créer un compte</Link>
				</li>


	</ul>
	}
	{this.newsletterPopup()}
	</nav>
</div>
);
}
}
