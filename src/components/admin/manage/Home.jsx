import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import moment from 'moment';
import request from '../../../services/Net';
import Meta from '../../utils/Meta';
import { withNotification } from '../../../services/withNotification';

export default withNotification(class AdminHome extends Component {
  state = {
    bundles: [],
  };

  componentDidMount() {
    this.getBundles();
  }

  getBundles = () => {
    const { notification } = this.props;
    request({
      url: '/bundle',
      method: 'get',
    }, notification).then((res) => {
      const sorted = res.filter(({ state }) => state >= 2).sort((a, b) => a.end_date.toString().localeCompare(b.end_date.toString()));
      this.setState({ bundles: sorted });
    });
  };

  render() {
    const { bundles } = this.state;
    return (
      <div>
        <Meta title="Espace administrateur" />
        <div className="col-4">
          <p>Parrainages arrivant bientôt à expiration :</p>
          <div className="newcard">
            {bundles.map(bundle => <p>{moment(bundle.end_date).format('DD/MM/YYYY')} <Link to={`/admin/manage/bundle/${bundle.id}`}>Gérer</Link></p>)}
          </div>
        </div>
      </div>
    );
  }
});
