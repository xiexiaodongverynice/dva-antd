import React from 'react';
import { connect } from 'dva';
import RoleDetail from '../../components/role/detail';

const roleDetail = ({ role, dispatch, location }) => {
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 525 }}>
      <RoleDetail role={role} dispatch={dispatch} location={location} />
    </div>
  );
};

function mapStateToProps(state) {
  const { role } = state.roles;
  return {
    loading: state.loading.models.roles,
    role,
  };
}

export default connect(mapStateToProps)(roleDetail);
