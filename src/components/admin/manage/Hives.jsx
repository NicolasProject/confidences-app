import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { Button } from '@cda/button';
import Input from '@cda/input';

import request from '../../../services/Net';
import { handleChange } from '../../../services/FormService';
import Loading from '../../utils/Loading';
import Meta from '../../utils/Meta';
import 'react-datepicker/dist/react-datepicker.css';
import { withNotification } from '../../../services/withNotification';
import Search from './hives/Search';

class AdminManageHives extends Component {
  state = {
    hives: null,
    newHive: '',
    selected: null,
    actu: '',
    actuTitle: '',
    actuDate: '',
    ratio: 0,
    stateFeedback: 0,
    feedback: '',
  };

  componentDidMount() {
    this.get();
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

  searchHandler = queryString => {
    const { notification } = this.props;
    console.log(queryString);
    request({
      url: `/hive/bundle/owner/${queryString}`,
      method: 'GET',
    }, notification).then((res) => {
      this.setState({
        hives: res,
      });
    });
  };

  changeImg(e) {
    const { selected } = this.state;
    const { notification } = this.props;
    request({
      url: `hive/img/${selected.id}`,
      method: 'PUT',
      data: {
        img: e,
      },
    }, notification);
  }

  render() {
    const { newHive } = this.state;
    const { history } = this.props;
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
          <div className="col">
            <div className="row">
              <Search handler={this.searchHandler} className="col" />
              <form className="col form-inline" onSubmit={this.addHive.bind(this)}>
                <Input type="text" className="mx-2" name="newHive" value={newHive} placeholder="Nom commun de la nouvelle ruche" onChange={handleChange.bind(this)} />
                <Button type="submit">Créer la ruche</Button>
              </form>
            </div>
            <div style={{ maxHeight: '50vh', overflowY: 'scroll' }}>
              {this.state.hives
                ? (
                  <table className="table table-hover">
                    <tbody>
                      <tr>
                        <th>Nom</th>
                      </tr>
                      {this.state.hives && this.state.hives.map(hive => (
                        <tr key={hive.id} onClick={() => history.push(`/admin/manage/hive/${hive.id}`)} style={{ cursor: 'pointer' }}>
                          <td>{hive.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
                : <Loading />}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default withNotification(withRouter(AdminManageHives));
