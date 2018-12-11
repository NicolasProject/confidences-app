import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import NotificationSystem from 'react-notification-system';
import EditAddress from './EditAddress';
import ViewAddress from './ViewAddress';
import request from '../../../services/Net';

export default class Address extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.state = {
      edit: false,
      address: data,
    };
  }

  componentWillReceiveProps({ data }) {
    if (data) {
      this.setState({
        address: { ...data, sexe_m: (data.sexe_m) ? '1' : '0' },
      });
    } // pres operation
  }

  updateAddress = (event) => {
    this.setState({
      address: { ...this.state.address, [event.target.name]: event.target.value },
    });
  }

  submitAddress = (e) => {
    e.preventDefault();
    request({
      url: `/address/${this.state.address.id}`,
      method: 'PUT',
      data: this.state.address,
    }, this.refs.notif).then((res) => {
      this.setState({ edit: false });
    });
  }

  render() {
    return (
      <div>
        <NotificationSystem ref="notif" />
        {(!this.state.edit)
          ? (
            <div>
              <ViewAddress data={this.state.address} />
              <div className="text-right mt-2">
                <button className="btn btn-secondary btn-sm" onClick={() => { this.setState({ edit: true }); }}>
                  <FontAwesome name="pencil" />
&nbsp;Editer cette adresse

                </button>
              </div>
            </div>
          )
          : <EditAddress data={this.state.address} onChange={this.updateAddress} onSubmit={this.submitAddress} company={this.props.company} />}
      </div>
    );
  }
}
