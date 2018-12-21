import React from 'react'
import Loading from '../../../utils/Loading'
import State from './State/State'
import UserType from './UserType/UserType'

const List = (props) => (
  (props.data) ?
    <table className="table table-hover">
      <thead>
        <tr>
          <th><input type="checkbox" /></th>
          <th>Type d'utilisateur</th>
          <th>Nom de l'utilisateur</th>
          <th>État du parrainage</th>
        </tr>
      </thead>
      <tbody>
        {props.data.map((user) => (
          <tr key={user.id} onClick={props.select.bind(this, user.id)} style={{ cursor: 'pointer' }} >
            <td><input type="checkbox" /></td>
            <td><UserType type={user.user_type} /></td>
            <td>{user.firstname + ' ' + user.name + ' ' + user.company_name}</td>
            <td>{(user.bundles[0]) ? <State level={user.bundles[0].state} /> : 'Pas de parrainage'}</td>
          </tr>
        ))}
      </tbody>
    </table>
    : <Loading />
)

export default List;
