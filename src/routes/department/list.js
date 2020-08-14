import React from 'react';
import { connect } from 'dva';
import DepartmentList from '../../components/department/list';

const departments = ({ dispatch }) => {
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 525 }}>
      <DepartmentList dispatch={dispatch} />
    </div>
  );
};

export default connect()(departments);
