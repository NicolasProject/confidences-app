import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Input from '@cda/input';

import request from '../../../../services/Net';
import List from './List';
import { withNotification } from '../../../../services/withNotification';

export default withNotification(class AdminManageBundle extends Component {
  state = {
    bundles: [],
    filtered: null,
    criteria: '',
    e: true,
    p: true,
    redirectId : null
  };

  componentDidMount() {
    this.get();
    this.refs.searchInput.focus();
  }

  get() {
    const { notification } = this.props;
    request({
      url: '/bundle',
      method: 'get'
    }, notification).then((res) => {
      if (this.props.match.path === '/admin/manage/bundle/unpaid') {
        res = res.filter((e) => (e.state === 0));
      }
      if (this.props.match.path === '/admin/manage/bundle/pending') {
        res = res.filter((e) => (e.state === 1));
      }
      if (this.props.match.path === '/admin/manage/bundle/paid') {
        res = res.filter((e) => (e.state === 2));
      }
      if (this.props.match.path === '/admin/manage/bundle/ok') {
        res = res.filter((e) => (e.state === 3));
      }
      this.setState({
        bundles : res,
        filtered : res
      })
    })
  }

  search = (e) => {
    this.setState({
      criteria : e.target.value.toLowerCase()
    }, () => {
      this.filter();
    });
  }

  checkValidation = (e) => {
    if (e.key === 'Enter') {
      this.setState({ redirectId : this.state.filtered[0].id })
    }
    if (e.key === 'ArrowDown') {
      const tmp = this.state.filtered;
      const row = tmp.shift();
      tmp.push(row);
      this.setState({
        filtered : tmp
      })
    }
    if (e.key === 'ArrowUp') {
      const tmp = this.state.filtered;
      const row = tmp.pop();
      tmp.unshift(row);
      this.setState({
        filtered : tmp
      })
    }
  }

  handleFilter = (e) => {
    this.setState({
      [e.target.name]: !this.state[e.target.name]
    }, () => {
      this.filter();
    })
  }

  filter = () => {
    let res = this.state.bundles.filter((elem) => {
      if ((elem.owner && elem.owner.name && elem.owner.name.toLowerCase().indexOf(this.state.criteria) >= 0)
      || (elem.owner && elem.owner.firstname && elem.owner.firstname.toLowerCase().indexOf(this.state.criteria) >= 0)
      || (elem.owner && elem.owner.company_name && elem.owner.company_name.toLowerCase().indexOf(this.state.criteria) >= 0)
      || (elem.owner && elem.name && elem.name.toLowerCase().indexOf(this.state.criteria) >= 0)
      || (elem.owner && elem.firstname && elem.firstname.toLowerCase().indexOf(this.state.criteria) >= 0)
      || (elem.owner && elem.email && elem.email.toLowerCase().indexOf(this.state.criteria) >= 0)) {
        return true;
      } else {
        return false;
      }
    });
    res = res.filter((elem) => {
      if ((this.state.p && elem.owner.user_type === 1) || (this.state.e && elem.owner.user_type === 2)) {
        return true;
      } else {
        return false;
      }
    })
    this.setState({
      filtered : res
    });
  }

  select = (id) => {
    this.setState({
      redirectId : id,
    });
  };

  onKeyDown = (e) => {
    console.log(e);
  };

  render () {
    return (
      <div className="row">
        {this.state.redirectId && <Redirect push to={"/admin/manage/bundle/"+this.state.redirectId} />}
        <div className="col">
          <div className="row my-2">
            <div className="col-4">
              <Input type="text" value={this.state.criteria} ref="searchInput" onChange={this.search} placeholder="Rechercher..." onKeyDown={this.checkValidation} />
              <small className="form-text text-muted">Appuyez sur ⏎ pour accéder au premier parrainage, ⇩ ou ⇧ pour naviguer</small>
            </div>
            <div className="col-2 my-2">
              <label htmlFor="p"><input type="checkbox" name="p" id="p" checked={this.state.p} onChange={this.handleFilter} /> Particuliers</label>&nbsp;&nbsp;
              <label htmlFor="e"><input type="checkbox" name="e" id="e" checked={this.state.e} onChange={this.handleFilter} /> Entreprises</label>&nbsp;&nbsp;
            </div>
          </div>
          <List data={this.state.filtered} select={this.select} />
        </div>
      </div>
    )
  }
});
