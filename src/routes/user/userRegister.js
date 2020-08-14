import React from 'react';
import { connect } from 'dva';
import UserRegister from '../../components/user/userRegister';

const Register = ({ dispatch, body, proList, roleList, dutyList, deptList, oper }) => {
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 525 }}>
      <UserRegister
        body={body}
        proList={proList}
        roleList={roleList}
        dutyList={dutyList}
        deptList={deptList}
        dispatch={dispatch}
        oper={oper}
      />
    </div>
  );
};

function mapStateToProps(state) {
  const { body } = state.register;
  const { proList } = state.register;
  const { roleList } = state.register;
  const { dutyList } = state.register;
  const { deptList } = state.register;
  const { oper } = state.register;
  // console.log(roleList);
  return {
    body, proList, roleList, dutyList, deptList, oper,
  };
}
export default connect(mapStateToProps)(Register);
