import React, { Component } from 'react';
import logoSquare from '../assets/img/logo-square.png';
import { Link, Redirect } from 'react-router-dom';
import { isLoggedIn } from '../services/AuthService';

export default class Header extends Component {

	constructor(props) {
		super(props);
		this.state = {
			redirect : false
		}
	}

	render () {
		return (
			<nav className="navbar navbar-toggleable-md navbar-light">
				<button className="navbar-toggler navbar-toggler-right align-self-center" type="button" data-toggle="collapse" data-target="#navbarNav">
					<span className="navbar-toggler-icon"></span>
				</button>
				{(this.state.redirect)?<Redirect to="/" />:null}
				<Link className="navbar-brand" to="/">
					<img src={logoSquare} width="auto" height="64" alt="Logo Confidences d'Abeilles" />
				</Link>
				<div className="hidden-lg-up collapse" style={{justifyContent: 'space-between'}} id="navbarNav" onClick={() => { document.getElementById("navbarNav").classList.remove("show") }}>
					{(isLoggedIn())?
						<ul className="navbar-nav">
							<li className="nav-item" data-toggle="collapse" data-target="#navbarNav">
								<Link className="nav-link" to="/tarifs">Tarifs</Link>
							</li>
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
								<Link className="nav-link" to="/contributor/presentation">Partenaire</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to="/tarifs">Tarifs</Link>
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
								<Link className="nav-link" to="/team">L'équipe</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to="/contact">Contact</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to="/jobs">Jobs</Link>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="https://confidencesdabeilles.fr/blog" target="_blank" rel="noopener noreferrer">Blog</a>
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
								<Link className="nav-link" to="/about">Notre histoire</Link>
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
								<a className="nav-link" href="https://confidencesdabeilles.fr/blog" target="_blank" rel="noopener noreferrer">Blog</a>
							</li>
							<div className="dropdown-divider"></div>
							<li className="nav-item">
								<Link className="nav-link" to="/login">Se connecter</Link>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="/" data-toggle="modal" data-target="#createAccount">Créer un compte</a>
							</li>
						</ul>
					}
		</div>
			{(isLoggedIn())?
				<ul className="navbar-nav hidden-md-down">
					<li className="nav-item">
						<Link className="nav-link" to="/tarifs">Tarifs</Link>
					</li>
				</ul>
				:
				<ul className="navbar-nav hidden-md-down">
					<li className="nav-item">
						<Link className="nav-link" to="/company/presentation">Entreprise</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link" to="/individual/presentation">Particulier</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link" to="/contributor/presentation">Partenaire</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link" to="/tarifs">Tarifs</Link>
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
							<Link className="dropdown-item" to="/team">L'équipe</Link>
							<Link className="dropdown-item" to="/contact">Contact</Link>
							<Link className="dropdown-item" to="/jobs">Jobs</Link>
							<a className="dropdown-item" href="https://confidencesdabeilles.fr/blog" target="_blank" rel="noopener noreferrer">Blog</a>
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
			<li className="nav-item dropdown">
				<a className="nav-link dropdown-toggle" style={{ cursor : 'pointer' }} id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					La société
				</a>
				<div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
					<Link className="dropdown-item" to="/about">Notre histoire</Link>
					<Link className="dropdown-item" to="/team">L'équipe</Link>
					<Link className="dropdown-item" to="/contact">Contact</Link>
					<Link className="dropdown-item" to="/jobs">Jobs</Link>
					<a className="dropdown-item" href="https://confidencesdabeilles.fr/blog" target="_blank" rel="noopener noreferrer">Blog</a>
				</div>
			</li>

			<li className="nav-item">
				&nbsp;&nbsp;<Link className="btn btn-primary" to="/login">Se connecter</Link>
		</li>
		<li className="nav-item">
			&nbsp;&nbsp;<a className="btn btn-primary" href="/" data-toggle="modal" data-target="#createAccount">Créer un compte</a>
		</li>


</ul>
}
<div className="modal fade" id="createAccount" role="dialog">
	<div className="modal-dialog" role="document">
		<div className="modal-content">
			<div className="modal-header">
				<h5 className="modal-title" id="exampleModalLabel">Je suis ...</h5>
				<button type="button" className="close" data-dismiss="modal">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div className="modal-body text-center">
				<a href="/signup/company" className="btn btn-warning">Une Entreprise</a><br /><br />
				<a href="/signup/individual" className="btn btn-warning">Un Particulier</a><br /><br />
				<a href="/signup/contributor" className="btn btn-warning">Un Partenaire</a>
			</div>
		</div>
	</div>
</div>

</nav>
);
}
}
