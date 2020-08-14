import React from 'react';
import { connect } from 'dva';
import Grouplist from '../../components/group/list';

const Groups = ({ dispatch }) => {
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 525 }}>
      <Grouplist dispatch={dispatch} />
    </div>
  );
};

export default connect()(Groups);
