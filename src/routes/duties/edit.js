import React from 'react';
import { connect } from 'dva';

import DutiesFrom from '../../components/duties/form';


const dutiesEdit = ({ duties, dispatch, location }) => {
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 525 }}>
      <DutiesFrom duties={duties} dispatch={dispatch} location={location} />
    </div>
  );
};

function mapStateToProps(state) {
  const { duties } = state.dutiess;
  return {
    loading: state.loading.models.dutiess,
    duties,
  };
}

export default connect(mapStateToProps)(dutiesEdit);
