import React from 'react';
import { connect } from 'dva';
import DutiesList from '../../components/duties/list';

const dutiess = ({ dispatch }) => {
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 525 }}>
      <DutiesList dispatch={dispatch} />
    </div>
  );
};

export default connect()(dutiess);
