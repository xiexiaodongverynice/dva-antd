import React from 'react';
import { connect } from 'dva';
import GroupCopy from '../../components/group/copy';


const groupCopy = ({ group, dispatch, location, copyGroup }) => {
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 525 }}>
      <GroupCopy group={group} copyGroup={copyGroup} dispatch={dispatch} location={location} />
    </div>
  );
};

function mapStateToProps(state) {
  const { group, copyGroup } = state.groups;
  return {
    loading: state.loading.models.groups,
    group,
    copyGroup,
  };
}

export default connect(mapStateToProps)(groupCopy);
