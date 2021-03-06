import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';
import ReactHtmlParser from 'react-html-parser';

import request from '../../services/Net';
import FooterPage from './FooterPage';
import Meta from '../utils/Meta';
import Loading from '../utils/Loading';
import Imagebox from '../utils/Imagebox';
import { getId } from '../../services/AuthService';
import { withNotification } from '../../services/withNotification';

const defaultImg = require("../../assets/img/profile.png");

export default withNotification(class CompanyPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      user: null,
      cover: null,
      hives: [],
      news: [],
      redirect: false,
      loading: true,
      english: false
    }
  }

  componentDidMount() {
    const { notification } = this.props;
    request({
      url: 'users/namespace/' + this.props.match.params.namespace,
      method: 'get'
    }, notification).then((res) => {
      if (!res.visible && res.id !== getId()) {
        this.setState({ redirect: true });
      }
      this.setState({
        user: res,
        english: res.english,
        cover: res.cover,
        bundleState: res.bundles[0].state,
        visible: res.visible,
        loading: false
      });
      request({
        url: '/news/owner/' + res.id,
        method: 'get'
      }, notification).then((res) => {
        this.setState({
          news: res
        })
      });
      request({
        url: '/hive/bundle/' + res.bundles[0].id,
        method: 'get'
      }, notification).then((res) => {
        this.setState({
          hives: res,
          selectedHive: (res[0]) ? res[0].id : null,
        })
      });
    }).catch((err) => {
      this.setState({
        redirect: true
      })
    })
  }

  deployActu(e) {
    if (e.target.dataset.deployed === 'true') {
      e.target.previousSibling.style.height = "6em";
      e.target.innerHTML = "------- développer -------------------------------------------------------------------------------------------------------------------------";
      e.target.setAttribute('data-deployed', 'false');
    } else {
      e.target.innerHTML = "------- réduire -------------------------------------------------------------------------------------------------------------------------";
      e.target.setAttribute('data-deployed', 'true');
      e.target.previousSibling.style.height = e.target.previousSibling.childNodes[0].clientHeight + "px";
    }
  }

  displayImg(e) {
    this.setState({
      selectedHive: e.target.dataset.hive
    })
  }

  render() {
    return (
      <div>
        {(this.state.redirect) ? <Redirect to="/" /> : null}
        {(!this.state.loading) ? <div>
          {(this.state.bundleState < 2) &&
            <div className="container-fluid">
              <div className="row">
                <div style={{ width: '100%', backgroundColor: 'red', color: 'white', fontFamily: "HighTo", fontWeight: 'bold', padding: "1em", textAlign: 'center' }}>
                  Attention, ceci est un aperçu de votre page dédiée, vous pourrez la rendre publique une fois votre paiement validé.
							</div>
              </div>
            </div>}
          {(this.state.bundleState >= 2 && !this.state.visible) &&
            <div className="container-fluid">
              <div className="row">
                <div style={{ width: '100%', backgroundColor: '#E49C00', color: 'white', fontFamily: "HighTo", fontWeight: 'bold', padding: "1em", textAlign: 'center' }}>
                  Attention, ceci est un aperçu de votre page dédiée, vous devez la rendre publique via votre tableau de bord pour que les visiteurs puissent la consulter.
							</div>
              </div>
            </div>}
          <div className="container">
            <Meta title="Page entreprise" />
            <div className="row justify-content-center">
              <h1 style={{ backgroundColor: "#E49C00", fontFamily: "HighTo", color: 'white', padding: "0.4em 2.5em", zIndex: '5' }}><small>{(this.state.user) ? this.state.user.company_name.toUpperCase() : null}</small></h1>
              <div className="col-lg-12" style={{ marginTop: '-5.3em', backgroundPosition: 'center', height: '20em', backgroundImage: 'url(' + ((this.state.cover) ? process.env.REACT_APP_CONTENT_DOMAIN + '/' + this.state.cover : '') + ')', backgroundSize: 'cover' }}>
              </div>
            </div>
          </div>
          <div className="container-fluid">
            <div className="row">
              <div style={{ width: '100%', height: '1em', backgroundColor: '#E49C00' }}>
              </div>
            </div>
          </div>
          <div className="container" style={{ fontFamily: "HighTo", color: '#666666', fontSize: '1.25em' }}>
            <div className="row py-5">
              <div className="col-lg-8 px-4">
                <div className="row">
                  <div className="col-lg-6 px-4" style={{ textAlign: 'justify' }}>
                    <h2 style={{ color: '#E49C00' }}>{(this.state.user) ? this.state.user.company_name.toUpperCase() : null}</h2>
                    <div style={{ width: '100%', height: '2px', backgroundColor: '#E49C00' }} className="mb-4" ></div>
                    <p>
                      {(this.state.user && this.state.user.description) ? this.state.user.description : "Cette entreprise n'a pas encore rédigé sa description"}
                    </p>
                    <p className="text-center my-3">
                      <img src={(this.state.user && this.state.user.logo) ? process.env.REACT_APP_CONTENT_DOMAIN + '/' + this.state.user.logo : defaultImg} alt="Logo entreprise" className="img-fluid" />
                    </p>
                    {(this.state.user && this.state.user.link1_url && this.state.user.link1_name) ?
                      <div className="col text-center">
                        <a target="_blank" rel="noopener noreferrer" className="btn-company" href={(this.state.user) ? this.state.user.link1_url : null}>{(this.state.user) ? this.state.user.link1_name.toUpperCase() : null}</a>
                      </div> : null}
                    {(this.state.user && this.state.user.link2_url && this.state.user.link2_name) ?
                      <div className="col text-center">
                        <a target="_blank" rel="noopener noreferrer" className="btn-company" href={(this.state.user) ? this.state.user.link2_url : null}>{(this.state.user) ? this.state.user.link2_name.toUpperCase() : null}</a>
                      </div> : null}
                  </div>
                  <div className="col-lg-6 px-5 py-2" style={{ backgroundColor: '#E49C00', color: 'white' }}>
                    <h2 className="mt-4">{(this.state.english) ? 'OUR COMMITMENT TO SUSTAINABILITY ' : 'NOTRE ENGAGEMENT POUR LA BIODIVERSITÉ'}</h2>
                    <div style={{ width: '100%', height: '1px', backgroundColor: 'white' }} className="mb-4" ></div>
                    <p>
                      {(this.state.user && this.state.user.involvement) ?
                        this.state.user.involvement
                        : ''}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 px-4" style={{ position: "relative" }}>
                <h2 style={{ color: '#E49C00' }}>{(this.state.english) ? 'OUR BEEHIVES' : 'NOS RUCHES'}</h2>
                <div style={{ width: '100%', height: '2px', backgroundColor: '#E49C00' }} className="mb-4" ></div>
                {this.state.hives.map((hive) => {
                  return (
                    <div className={(this.state.selectedHive === hive.id) ? 'ruche ruche-me' : 'ruche'} data-hive={hive.id} onMouseEnter={this.displayImg.bind(this)}>
                      <img src={require("../../assets/img/rayon.png")} className="img-fluid rayon" alt="Rayon" />
                      <p style={{ padding: '0px', margin: '0', overflowX: 'visible' }} className="" >{hive.name.toUpperCase()}</p>
                      <Link to={'/hive/' + hive.id} style={{ color: '#666666', fontSize: '0.9em', lineHeight: '1em' }} >Voir en détails</Link>
                    </div>
                  )
                })}
                <div style={{ position: 'relative' }}>
                  {this.state.hives.map((hive) => {
                    return (
                      <div style={{ backgroundImage: 'url(' + process.env.REACT_APP_CONTENT_DOMAIN + '/' + hive.imgs[0] + ')', height: '10em', width: '100%' }} alt={hive.name} className={(this.state.selectedHive === hive.id) ? 'ruche-img' : 'ruche-img-hidden'} id={"img-" + hive.id} />
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="row justify-content-end align-items-center mb-4">
              <div className="col-lg-12">
                <h2 style={{ color: '#E49C00' }}>{(this.state.english) ? 'LATEST NEWS' : 'LES DERNIÈRES ACTUALITÉS'}</h2>
                <div style={{ width: '100%', height: '1px', backgroundColor: '#E49C00' }} className="mb-4" ></div>
                {this.state.user && this.state.news.map((actu) => {
                  return (
                    <div className="my-2 row">
                      <div className="actu-first-block col-lg-4">
                        <Imagebox className="actu-img"
                          src={process.env.REACT_APP_CONTENT_DOMAIN + '/' + actu.img}
                          alt={actu.img}
                        />
                      </div>
                      <div className="actu-second-block col-lg-8">
                        <h3 className="actu-title">{actu.title}<small className="actu-date">{moment(actu.date).format("DD.MM.YYYY")}</small></h3>
                        <div style={{ width: '100%', height: '1px', backgroundColor: '#E49C00' }} className="mb-4" ></div>
                        <div className="actu-content">
                          <p>
                            {ReactHtmlParser(actu.content)}
                          </p>
                        </div>
                        <p className="actu-btn" data-deployed="false" onClick={this.deployActu.bind(this)}>------- développer --------------------------------------------------------------------------------------------------------------------------------------------------------------------------</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <FooterPage english={this.state.english} />
          </div></div> :
          <div className="container my-5">
            <Loading />
            <p className="text-center">Chargement de la page entreprise...</p>
          </div>}
      </div>
    );
  }
});
