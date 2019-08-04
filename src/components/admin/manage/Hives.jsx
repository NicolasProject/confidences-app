import React, { Component } from 'react';
import { Link, Route, withRouter } from 'react-router-dom';

import { Button } from '@cda/button';
import Input from '@cda/input';
import { Columns, Item } from '@cda/flex';

import request from '../../../services/Net';
import { handleChange } from '../../../services/FormService';
import Loading from '../../utils/Loading';
import Meta from '../../utils/Meta';
import 'react-datepicker/dist/react-datepicker.css';
import { withNotification } from '../../../services/withNotification';
import Search from './hives/Search';
import AdminManageHivesBoard from './hives/Board';
import UserType from './users/UserType/UserType';

class AdminManageHives extends Component {
  state = {
    hives: null,
    newHive: '',
  };

  componentDidMount() {
    this.get();
  }

  get = () => {
    const { notification } = this.props;
    request({
      url: '/hive/bundle/owner',
      method: 'get',
    }, notification).then((res) => {
      this.setState({
        hives: res,
      });
    });
  };

  addHive = (e) => {
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
  };

  searchHandler = (queryString) => {
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

  render() {
    const { newHive, hives } = this.state;
    const { history } = this.props;
    return (
      <div>
        <Meta title="Gérer les ruches" />
        <div className="row">
          <div className="col">
            <div className="row mb-4">
              <Search handler={this.searchHandler} className="col" />
              <form className="col form-inline" onSubmit={this.addHive}>
                <Input type="text" className="mx-2" name="newHive" value={newHive} placeholder="Nom commun de la nouvelle ruche" onChange={handleChange.bind(this)} />
                <Button type="submit">Créer la ruche</Button>
              </form>
            </div>
            <Columns>
              <Item flex={1} style={{ height: '25rem', overflowY: 'scroll' }}>
                {hives
                  ? (
                    <table className="table table-hover">
                      <tbody>
                        <tr>
                          <th>Nom</th>
                        </tr>
                        {hives && hives.map(hive => (
                          <tr key={hive.id} onClick={() => history.push(`/admin/manage/hive/${hive.id}`)} style={{ cursor: 'pointer' }}>
                            <td>
                              <UserType type={hive.parrainType} />&nbsp;
                              {hive.name}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                  : <Loading />}
              </Item>
              <Route exact path="/admin/manage/hive/:hiveId" component={AdminManageHivesBoard} />
            </Columns>
          </div>
        </div>
      </div>
    );
  }
}

export default withNotification(withRouter(AdminManageHives));
