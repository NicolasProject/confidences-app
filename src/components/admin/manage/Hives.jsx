import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ReactStars from 'react-stars';

import request from '../../../services/Net';
import { handleChange } from '../../../services/FormService';
import Loading from '../../utils/Loading';
import Feedback from '../../utils/Feedback';
import Meta from '../../utils/Meta';
import 'react-datepicker/dist/react-datepicker.css';
import Pictures from './hives/Pictures';
import { withNotification } from '../../../services/withNotification';

export default withNotification(class AdminManageHives extends Component {
  state = {
    hives: null,
    newHive: '',
    selected: '',
    actu: '',
    actuTitle: '',
    actuDate: '',
    ratio: 0,
    stateFeedback: 0,
    feedback: '',
  }

  componentDidMount() {
    this.get();
  }

  handleDateChange(date) {
    this.setState({
      actuDate: date,
    });
  }

  get() {
    const { notification } = this.props;
    request({
      url: '/hive',
      method: 'get',
    }, notification).then((res) => {
      this.setState({
        hives: res,
      });
    });
  }

  getOne() {
    const { idSelected } = this.state;
    const { notification } = this.props;
    request({
      url: `/hive/${idSelected}`,
      method: 'get',
    }, notification).then((res) => {
      this.setState({
        selected: res,
      });
    });
  }

  addHive(e) {
    e.preventDefault();
    const { notification } = this.props;
    const { newHive } = this.state;
    request({
      url: '/hive',
      method: 'post',
      data: {
        name: newHive,
      },
    }, notification).then(() => {
      this.get();
      this.setState({
        newHive: '',
      });
    });
  }

  delete(id) {
    const { notification } = this.props;
    request({
      url: `/hive/${id}`,
      method: 'delete',
    }, notification).then(() => {
      this.get();
    });
  }

  createActu(e) {
    e.preventDefault();
    const { notification } = this.props;
    const {
      actu,
      actuTitle,
      actuDate,
      selected,
    } = this.state;
    const data = new FormData();
    data.append('content', actu);
    data.append('title', actuTitle);
    data.append('date', actuDate);
    if (document.getElementById('actu-img').files[0]) {
      data.append('img', document.getElementById('actu-img').files[0]);
    }
    request({
      url: `/news/hive/${selected.id}`,
      method: 'post',
      data,
      header: {
        'content-type': 'multipart/form-data',
      },
    }, notification).then(() => {
      this.setState({
        actuTitle: '',
        actu: '',
        actuDate: '',
      });
    });
  }

  updateActu(e) {
    e.preventDefault();
    const { notification } = this.props;
    const {
      actuModify,
      actuModifyTitle,
      actuModifyDate,
      newsModify,
    } = this.state;
    const data = new FormData();
    data.append('content', actuModify);
    data.append('title', actuModifyTitle);
    data.append('date', actuModifyDate);
    if (document.getElementById('actu-modify-img').files[0]) {
      data.append('img', document.getElementById('actu-modify-img').files[0]);
    }
    request({
      url: `/news/${newsModify}`,
      method: 'put',
      data,
    }, notification).then(() => {
      this.get();
      this.setState({
        selected: '',
      });
    });
  }

  deleteActu() {
    const { newsModify } = this.state;
    const { notification } = this.props;
    request({
      url: `/news/${newsModify}`,
      method: 'delete',
    }, notification).then(() => {
      this.get();
      this.setState({
        selected: '',
      });
    });
  }

  addPhoto(e) {
    e.preventDefault();
    const { notification } = this.props;
    const { selected } = this.state;
    const data = new FormData();
    data.append('id', selected.id);
    if (document.getElementById('hive-img').files[0]) {
      data.append('img', document.getElementById('hive-img').files[0]);
      request({
        url: '/hive/photo',
        method: 'post',
        data,
        header: {
          'content-type': 'multipart/form-data',
        },
      }, notification).then(() => this.getOne());
    }
  }

  launchModify(e) {
    e.preventDefault();
    const { notification } = this.props;
    const { target: { value } } = e;
    this.setState({
      newsModify: value,
    });

    request({
      url: `/news/${value}`,
      method: 'get',
    }, notification).then(({ title, content, date }) => {
      this.setState({
        actuModifyTitle: title,
        actuModify: content,
        actuModifyDate: date,
      });
    });
  }

  ratingChanged(e) {
    const { selected } = this.state;
    const { notification } = this.props;
    request({
      url: '/hive/ratio',
      method: 'POST',
      data: {
        id: selected.id,
        ratio: e,
      },
    }, notification);
  }

  saveFeedback(e) {
    e.preventDefault();
    const { notification } = this.props;
    const { selected, feedback } = this.state;
    request({
      url: 'hive/feedback',
      method: 'POST',
      data: {
        id: selected.id,
        feedback,
      },
    }, notification).then(() => {
      this.setState({
        stateFeedback: 0,
      });
    });
  }

  saveInformation(e) {
    e.preventDefault();
    const { notification } = this.props;
    const { selected, info } = this.state;
    request({
      url: 'hive/information',
      method: 'POST',
      data: {
        id: selected.id,
        information: info,
      },
    }, notification);
  }

  updateFeedback(event) {
    const objState = {};
    objState[event.target.name] = event.target.value;
    this.setState(objState);
    this.setState({
      stateFeedback: 1,
    });
  }

  changeImg(e) {
    const { selected } = this.state;
    const { notification } = this.props;
    request({
      url: `hive/img/${selected.id}`,
      method: 'PUT',
      data: {
        img: e
      }
    }, notification);
  }

  render() {
    const { newHive } = this.state;
    return (
      <div>
        <div className="row">
          <Meta title="Gérer les ruches" />
          <div className="col">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/admin/manage">Panel d'Administration</Link></li>
              <li className="breadcrumb-item active">Ruches</li>
            </ol>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4">
            <h3>Créer une ruche</h3>
            <form className="form-inline my-3" onSubmit={this.addHive.bind(this)}>
              <input type="text" className="form-control mx-2" name="newHive" value={newHive} placeholder="Nom commun de la nouvelle ruche" onChange={handleChange.bind(this)} />
              <button type="submit" className="btn btn-primary">Créer la ruche</button>
            </form>
            <div style={{ maxHeight: '50vh', overflowY: 'scroll' }}>
              {this.state.hives ?
                <table className="table table-sm">
                  <tbody>
                    <tr><th>Nom</th><th>Occupation</th><th></th></tr>
                    {this.state.hives && this.state.hives.map((hive) => {
                      return (
                        <tr key={hive.id} className={(this.state.selected.id === hive.id) ? 'table-info' : null}>
                          <td>{hive.name}</td><td>{hive.occupation} %</td>
                          <td>
                            <button className="btn btn-link btn-sm" onClick={() => {
                              this.setState({
                                idSelected: hive.id,
                                ratio: hive.ratio,
                                feedback: hive.feedback,
                                stateFeedback: 0,
                                imgsHive: hive.imgs,
                                info: hive.info
                              }, () => { this.getOne() });
                            }} >Gérer</button>
                            <Link to={"/hive/" + hive.id} className="btn btn-link btn-sm">
                              Voir
														</Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                : <Loading />}
            </div>
          </div>
          {(this.state.selected) ?
            <div className="col-lg-8">
              <div >
                <h3 className="my-4">Parrain lie a cette ruche</h3>
                {this.state.selected &&
                  this.state.selected.parrains.map((user, key) => {
                    return (
                      <h2 key={key}><small>{(user.company_name) ? user.company_name : user.firstname + ' ' + user.name}</small><br />{(key + 1 < this.state.selected.parrains.length) ? ' ~' : ''}</h2>
                    )
                  })}
              </div>
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
                  : null}
              </div>
              <div className="form-group">
                <h3 className="my-4">Information générale sur la ruche</h3>
                <textarea rows="5" className="form-control" name="info" onChange={handleChange.bind(this)} value={this.state.info} placeholder="Informations générale concernant la ruche" />
                <button onClick={this.saveInformation.bind(this)} className="btn btn-primary btn-sm mt-2">Sauvegarder</button>
              </div>

              <Feedback name={this.state.newsModify ? this.state.newsModify : null} hiveId={this.state.selected.id} />

              {this.state.selected.news ?
                <div>
                  <h3 className="my-4">Modifier une news</h3>
                  <select className="form-control" onChange={this.launchModify.bind(this)} name="newsModify">
                    <option selected disabled>News a modifier</option>
                    {this.state.selected.news.map((actu) => {
                      const date = (actu.date) ? moment(actu.date) : moment(actu.createdAt);
                      return (
                        <option value={actu.id} key={actu.id}>{actu.title} ( {date.format("DD/MM/YYYY")} )</option>
                      )
                    })}
                  </select>
                </div>
                : null}
              <h3 className="py-4">Ajouter des photos</h3>
              <form onSubmit={this.addPhoto.bind(this)}>
                <div className="form-group">
                  <label htmlFor="hive-img" className={(this.state.hiveImg) ? 'active-upload' : 'upload'} style={{ position: 'relative' }}>
                    <input type="file" className="form-control" id="hive-img" onChange={() => { this.setState({ hiveImg: document.getElementById("hive-img").files[0].name }) }} style={{ position: 'absolute', height: '5.5em', top: '0', left: "0", opacity: '0.0001' }} />
                    Glisser une image ou cliquez pour en sélectionner un parmi vos fichiers<br />
                    Taille recommandée : 400x300 - {(this.state.hiveImg) ? 'Sélectionné : ' + this.state.hiveImg : "Aucun fichier sélectionné"}
                  </label>
                </div>
                <button className="btn btn-primary">Ajouter cette photo</button>
              </form>
              {this.state.selected ?
                <Pictures data={this.state.selected.imgs} hiveId={this.state.selected.id} refresh={this.getOne.bind(this)} />
                : null}
            </div>
            : <div className="col"></div>}
        </div>
      </div>
    )
  }
});
