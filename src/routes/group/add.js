import React from 'react';
import { connect } from 'dva';
import GroupFrom from '../../components/group/form';


const groupAdd = ({ group, dispatch, location }) => {
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 525 }}>
      <GroupFrom group={group} dispatch={dispatch} location={location} />
    </div>
  );
};

function mapStateToProps(state) {
  const { group } = state.groups;
  return {
    loading: state.loading.models.groups,
    group,
  };
}

export default connect(mapStateToProps)(groupAdd);
