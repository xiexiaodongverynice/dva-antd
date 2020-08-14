import React from 'react';
import { connect } from 'dva';
import EditSimpleProfile from '../../components/profile/editSimpleProfile';

const EditProfile = ({ dispatch, data, proList }) => {
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 225 }}>
      <EditSimpleProfile data={data} proList={proList} dispatch={dispatch} />
    </div>
  );
};

function mapStateToProps(state) {
  const { data } = state.editProfile;
  const { proList } = state.editProfile;
  return { data, proList };
}
export default connect(mapStateToProps)(EditProfile);
