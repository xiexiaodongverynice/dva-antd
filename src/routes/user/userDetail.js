import React from 'react';
import { connect } from 'dva';
import UserDetail from './../../components/user/userDetail';

const Detail = ({ dispatch, body, groupList, logList }) => {
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 525 }}>
      <UserDetail
        body={body}
        groupList={groupList}
        logList={logList}
        dispatch={dispatch}
      />
    </div>
  );
};

// export default Products;
function mapStateToProps(state) {
  const { body } = state.detail;
  const { groupList } = state.detail;
  const { logList } = state.detail;
  return {
    body, groupList, logList,
  };
}
export default connect(mapStateToProps)(Detail);
