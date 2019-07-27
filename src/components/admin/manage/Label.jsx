import React, { useState } from 'react';
import { Button } from '@cda/button';
import { withNotification } from '../../../services/withNotification';
import request from '../../../services/Net';

const Label = ({ notification }) => {
  const [dluo, setDluo] = useState('');
  const [harvest, setHarvest] = useState('');

  const dluoHandler = e => setDluo(e.target.value);
  const harvestHandler = e => setHarvest(e.target.value);

  const generate = (e) => {
    e.preventDefault();
    request({
      url: '/label/bulk',
      method: 'POST',
      data: {
        dluo,
        harvest,
      },
    }, notification);
  };

  return (
    <form onSubmit={generate}>
      <input type="text" onChange={harvestHandler} placeholder="Récolte"/>
      <input type="text" onChange={dluoHandler} placeholder="Dluo"/>
      <Button type="submit">Générer</Button>
    </form>
  )
};

export default withNotification(Label);
