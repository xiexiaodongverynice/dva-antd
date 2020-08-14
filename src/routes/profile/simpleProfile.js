import React from 'react';
import { connect } from 'dva';
import SimpleProfile from '../../components/profile/simpleProfile';

const Profiles = ({ dispatch, body, pageNo, resultCount, pageSize, loading }) => {
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 225 }}>
      <SimpleProfile
        body={body}
        dispatch={dispatch}
        pageNo={pageNo}
        resultCount={resultCount}
        pageSize={pageSize}
        loading={loading}
      />
    </div>
  );
};

function mapStateToProps(state) {
  const { body, pageNo, resultCount, pageSize } = state.profile;
  const loading = state.loading.models.profile;
  return {
    body, pageNo, resultCount, pageSize, loading,
  };
}
export default connect(mapStateToProps)(Profiles);
