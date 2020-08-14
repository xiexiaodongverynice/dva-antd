import React from 'react';
import { connect } from 'dva';

import DepartmentFrom from '../../components/department/form';


const departmentAdd = ({ department, dispatch, location }) => {
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 525 }}>
      <DepartmentFrom department={department} dispatch={dispatch} location={location} />
    </div>
  );
};

function mapStateToProps(state) {
  const { department } = state.departments;
  return {
    loading: state.loading.models.departments,
    department,
  };
}

export default connect(mapStateToProps)(departmentAdd);
