import React from 'react';
import { connect } from 'dva';
import UserList from './../../components/user/userList';

const Users = ({ dispatch, body, pageNo, resultCount, pageSize, location, loading }) => {
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 525 }}>
      <UserList
        body={body}
        dispatch={dispatch}
        location={location}
        pageNo={pageNo}
        resultCount={resultCount}
        pageSize={pageSize}
        loading={loading}
      />
    </div>
  );
};

function mapStateToProps(state) {
  const { body } = state.user;
  const loading = state.loading.models.user;
  return {
    body, loading,
  };
}
export default connect(mapStateToProps)(Users);
