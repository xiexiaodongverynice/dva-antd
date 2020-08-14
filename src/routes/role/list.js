import React from 'react';
import { connect } from 'dva';
import RoleList from '../../components/role/list';

const Roles = ({ dispatch }) => {
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 525 }}>
      <RoleList dispatch={dispatch} />
    </div>
  );
};

export default connect()(Roles);
