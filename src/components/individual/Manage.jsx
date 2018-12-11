import React, { Component } from 'react';
import {
  Redirect, Route, Link, Switch,
} from 'react-router-dom';
import NotificationSystem from 'react-notification-system';
import FontAwesome from 'react-fontawesome';
import { isLoggedIn } from '../../services/AuthService';
import IndividualManageInfos from './manage/Infos';
import Bills from './manage/Bills';
import Account from './manage/Account';
import Custom from './manage/custom/Custom';
import profile from '../../assets/img/profile2.png';
import Bundle from './manage/Bundle';
import Meta from '../utils/Meta';
import NotFound from '../utils/NotFound';

export default class IndividualManage extends Component {
  render() {
    return (
      <div className="container py-4">
        <Meta title="Mon espace personnel" />
        <NotificationSystem ref="notif" />
        {(!isLoggedIn) ? <Redirect to="/" /> : null}
        <div className="row">
          <div className="col-lg-3 col-sm-12">
            <img src={profile} alt="Default profile" className="img-fluid" />
            <ul className="list-group">
              <Link to="/individual/manage" className="list-group-item">
                <FontAwesome name="archive" fixedWidth />
&nbsp;&nbsp;Mon parrainage
              </Link>
              <Link to="/individual/manage/customize" className="list-group-item">
                <FontAwesome name="flask" fixedWidth />
&nbsp;&nbsp;Mes pots de miel
              </Link>
              <Link to="/individual/manage/infos" className="list-group-item">
                <FontAwesome name="address-card" fixedWidth />
&nbsp;&nbsp;Mes informations
              </Link>
              <Link to="/individual/manage/bills" className="list-group-item">
                <FontAwesome name="file" fixedWidth />
&nbsp;&nbsp;Mes factures
              </Link>
              <Link to="/individual/manage/account" className="list-group-item">
                <FontAwesome name="gears" fixedWidth />
&nbsp;&nbsp;Mon compte
              </Link>
              <Link to="/logout" className="list-group-item">
                <FontAwesome name="sign-out" fixedWidth />
&nbsp;&nbsp;Deconnexion
              </Link>
            </ul>
          </div>
          <div className="col-lg-9 col-sm-12">
            <Switch>
              <Route exact path="/individual/manage" component={Bundle} />
              <Route exact path="/individual/manage/bills" component={Bills} />
              <Route exact path="/individual/manage/customize" component={Custom} />
              <Route exact path="/individual/manage/infos" component={IndividualManageInfos} />
              <Route exact path="/individual/manage/account" component={Account} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}