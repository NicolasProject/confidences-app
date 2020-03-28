import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import Input from '@cda/input';

import List from './users/List';
import request from '../../../services/Net';
import Meta from '../../utils/Meta';
import { withNotification } from '../../../services/withNotification';

class MainScreen extends Component {
  state = {
    users: [],
    filtered: [],
    selectedId: null,
    filters: {
      e: true,
      p: true,
      aa: true,
      edit: true,
      admin: true,
      unpaid: true,
      waiting: true,
      paid: true,
      done: true,
      no: true,
    },
    criteria: '',
  };

  componentDidMount() {
    this.getUsers();
    this.refs.searchInput.focus();
  }

  getUsers() {
    const { notification } = this.props;
    request({
      url: '/user',
      method: 'get',
    }, notification).then((res) => {
      this.setState({
        users: res,
      }, () => {
        this.filter();
      });
    });
  }

  checkFilter = (e) => {
    this.setState({
      filters: {
        ...this.state.filters,
        [e.target.name]: !this.state.filters[e.target.name],
      },
    }, () => { this.filter(); });
  }

  search = (e) => {
    this.setState({
      criteria: e.target.value,
    }, () => {
      this.filter();
    });
  }

  filter = () => {
    let tmp = this.state.users.filter(e => (
      ((e.user_type === 1 && this.state.filters.p)
      || (e.user_type === 2 && this.state.filters.e)
      || (e.user_type === 3 && this.state.filters.aa)
      || (e.user_type === 4 && this.state.filters.edit)
      || (e.user_type === 5 && this.state.filters.admin))
      && ((!e.bundles[0] && this.state.filters.no)
      || ((e.bundles[0] && e.bundles[0].state === 0) && this.state.filters.unpaid)
      || ((e.bundles[0] && e.bundles[0].state === 1) && this.state.filters.waiting)
      || ((e.bundles[0] && e.bundles[0].state === 2) && this.state.filters.paid)
      || ((e.bundles[0] && e.bundles[0].state === 3) && this.state.filters.done))
    ));
    tmp = tmp.filter((e) => {
      if ((e.firstname.toLowerCase().indexOf(this.state.criteria.toLowerCase()) >= 0)
      || (e.name.toLowerCase().indexOf(this.state.criteria.toLowerCase()) >= 0)
      || (e.company_name.toLowerCase().indexOf(this.state.criteria.toLowerCase()) >= 0) || this.state.criteria === '') {
        return true;
      }
      return false;
    });
    this.setState({
      filtered: tmp,
    });
  }

  select = (id) => {
    this.setState({
      selectedId: id,
    });
  }

  checkValidation = (e) => {
    if (e.key === 'Enter') {
      this.setState({ selectedId: this.state.filtered[0].id });
    }
    if (e.key === 'ArrowDown') {
      const tmp = this.state.filtered;
      const row = tmp.shift();
      tmp.push(row);
      this.setState({
        filtered: tmp,
      });
    }
    if (e.key === 'ArrowUp') {
      const tmp = this.state.filtered;
      const row = tmp.pop();
      tmp.unshift(row);
      this.setState({
        filtered: tmp,
      });
    }
  }

  render() {
    const csvData = this.state.filtered.map(({
      id,
      created_at,
      firstname,
      name,
      sexe_m,
      email,
      phone,
      addresses,
      bundles,
    }) => ({
      id,
      created_at,
      firstname,
      name,
      sexe_m,
      begin_date: bundles[0] && bundles[0].start_date,
      email,
      email_parrain: bundles[0] && bundles[0].email,
      nom_parrain: bundles[0] && bundles[0].name,
      prenom_parrain: bundles[0] && bundles[0].firstname,
      phone,
      status: bundles[0] && bundles[0].state,
      address: addresses[0] && addresses[0].address_line1,
      zipcode: addresses[0] && addresses[0].zipcode,
      city: addresses[0] && addresses[0].city,
      shipping_name: addresses[1] && addresses[1].name,
      shipping_firstname: addresses[1] && addresses[1].firstname,
      shipping_address: addresses[1] && addresses[1].address_line1,
      shipping_address_2: addresses[1] && addresses[1].address_line2,
      shipping_zipcode: addresses[1] && addresses[1].zipcode,
      shipping_city: addresses[1] && addresses[1].city,
      country: addresses[1] && addresses[1].country,
      shipping_phone: addresses[1] && addresses[1].phone,
      price: bundles[0] && bundles[0].price,
      bees: bundles[0] && bundles[0].bees,
      hives: bundles[0] && bundles[0].hives,
      present: bundles[0] && bundles[0].present ? 'oui' : 'non',
      label: bundles[0] && bundles[0].label,
    }));
    return (
      <div>
        <Meta title="Gérer les utilisateurs" />
        {this.state.selectedId && <Redirect to={`/admin/manage/user/${this.state.selectedId}`} push />}
        <div className="row">
          <div className="col">
            <Input type="text" value={this.state.criteria} ref="searchInput" onChange={this.search} placeholder="Rechercher..." onKeyDown={this.checkValidation} />
            <small className="form-text text-muted">Appuyez sur ⏎ pour accéder au premier utilisateur, ⇩ ou ⇧ pour naviguer</small>
            <CSVLink data={csvData}>Exporter</CSVLink>
          </div>
          <div className="col">
            <label htmlFor="p">
              <Input type="checkbox" name="p" id="p" checked={this.state.filters.p} onChange={this.checkFilter} />
              {' '}
Particuliers
            </label>
            <br />
            <label htmlFor="e">
              <Input type="checkbox" name="e" id="e" checked={this.state.filters.e} onChange={this.checkFilter} />
              {' '}
Entreprises
            </label>
            <br />
            <label htmlFor="aa">
              <input type="checkbox" name="aa" id="aa" checked={this.state.filters.aa} onChange={this.checkFilter} />
              {' '}
Apporteurs d'Affaires
            </label>
            <br />
            <label htmlFor="edit">
              <input type="checkbox" name="edit" id="edit" checked={this.state.filters.edit} onChange={this.checkFilter} />
              {' '}
Editeurs
            </label>
            <br />
            <label htmlFor="admin">
              <input type="checkbox" name="admin" id="admin" checked={this.state.filters.admin} onChange={this.checkFilter} />
              {' '}
Admins
            </label>
            <br />
          </div>
          <div className="col">
            <label htmlFor="unpaid">
              <input type="checkbox" name="unpaid" id="unpaid" checked={this.state.filters.unpaid} onChange={this.checkFilter} />
              {' '}
Non réglé
            </label>
            <br />
            <label htmlFor="waiting">
              <input type="checkbox" name="waiting" id="waiting" checked={this.state.filters.waiting} onChange={this.checkFilter} />
              {' '}
En attente
            </label>
            <br />
            <label htmlFor="paid">
              <input type="checkbox" name="paid" id="paid" checked={this.state.filters.paid} onChange={this.checkFilter} />
              {' '}
Payé
            </label>
            <br />
            <label htmlFor="done">
              <input type="checkbox" name="done" id="done" checked={this.state.filters.done} onChange={this.checkFilter} />
              {' '}
En place
            </label>
            <br />
            <label htmlFor="no">
              <input type="checkbox" name="no" id="no" checked={this.state.filters.no} onChange={this.checkFilter} />
              {' '}
Pas de parraiange
            </label>
            <br />
          </div>
        </div>
        <div className="row">
          <List data={this.state.filtered} select={this.select} />
        </div>
      </div>
    );
  }
}

export default withNotification(MainScreen);
