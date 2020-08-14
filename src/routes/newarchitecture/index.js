import React from 'react';
import { connect } from 'dva';
import ArchitectureIndexs from '../../components/architecture/architecture';

const architecture = ({ dispatch }) => {
  return (
    <div style={{ padding: 45, background: '#fff', minHeight: 525 }}>
      <ArchitectureIndexs dispatch={dispatch} />
    </div>
  );
};
export default connect()(architecture);
