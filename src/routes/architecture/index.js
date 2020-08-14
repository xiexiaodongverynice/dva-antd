import React from 'react';
import { connect } from 'dva';
import ArchitectureIndexs from '../../components/architecture/index';

const architecture = ({ dispatch }) => {
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 525 }}>
      <ArchitectureIndexs dispatch={dispatch} />
    </div>
  );
};
export default connect()(architecture);
