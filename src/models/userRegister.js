import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as userService from '../services/user';
import * as baseModel from './base';
import mixinModels from '../libs/mixinModels';

const initBody = {
  employee_number: '',
  sex: '',
  email: '',
  nickname: '',
  tenantId: '',
  name: '',
  id: '',
  loginTime: '',
  rol_id: '',
  pro_id: '',
  dep_id: '',
  dut_id: '',
  status: '',
};

const initialState = {
  body: { result: [] },
  head: {},
  proList: [],
  roleList: [],
  dutyList: [],
  deptList: [],
  oper: '',
}

// subscriptions -> effects -> reducers
export default mixinModels(baseModel, {
  namespace: 'register',
  state: Object.assign({}, initialState),
  reducers: {
    save(state, { payload: { body, head, proList, roleList, dutyList, deptList, oper } }) {
      return { ...state, body, head, proList, roleList, dutyList, deptList, oper };
    },
  },

  effects: {
    *initEdit({ payload }, { call, put }) {
      // 初始化用户数据
      let body = {};
      let head = {};
      const { data } = yield call(userService.getUserInfoByUserId, payload);
      if (data.data) {
        body = data.data.body;
        head = data.data.head;
      }
      // 获得所有简档
      let proList = [];
      const proData = yield call(userService.getProfileList, payload);
      if (proData.data) {
        proList = proData.data.data.body.result;
      }
      // 获得所有角色
      let roleList = [];
      const roleData = yield call(userService.getRoleList, payload);
      if (roleData.data) {
        roleList = roleData.data.data.body.result;
      }
      // 获得所有职务
      let dutyList = [];
      const dutyData = yield call(userService.getDutyList, payload);
      if (dutyData.data) {
        dutyList = dutyData.data.data.body.result;
      }
      // 获得所有部门
      let deptList = [];
      const deptData = yield call(userService.getDeptList, payload);
      if (deptData.data) {
        deptList = deptData.data.data.body.result;
      }
      // 操作类型
      const oper = payload.type;
      yield put({
        type: 'save',
        payload: { body, head, proList, roleList, dutyList, deptList, oper },
      });
    },
    *initCreate({ payload }, { call, put }) {
      // 初始化用户数据
      const body = { result: initBody };
      const head = {};
      // 获得所有简档
      let proList = [];
      const proData = yield call(userService.getProfileList, payload);
      if (proData.data) {
        proList = proData.data.data.body.result;
      }
      // 获得所有角色
      let roleList = [];
      const roleData = yield call(userService.getRoleList, payload);
      if (roleData.data) {
        roleList = roleData.data.data.body.result;
      }
      // 获得所有职务
      let dutyList = [];
      const dutyData = yield call(userService.getDutyList, payload);
      if (dutyData.data) {
        dutyList = dutyData.data.data.body.result;
      }
      // 获得所有部门
      let deptList = [];
      const deptData = yield call(userService.getDeptList, payload);
      if (deptData.data) {
        deptList = deptData.data.data.body.result;
      }
      // 操作类型
      const oper = payload.type;
      yield put({
        type: 'save',
        payload: { body, head, proList, roleList, dutyList, deptList, oper },
      });
    },
    *register({ payload }, { call, put }) {
      if (payload.oper === 'add') {
        const { data } = yield call(userService.register, payload.obj);
        if (data !== undefined
          && data.data !== undefined
          && data.data.head !== undefined
          && data.data.head.code === 200) {
          message.success('注册成功！');
          yield put(routerRedux.push('/user'));
        } else {
          message.error(data.data.head.msg);
        }
      } else {
        const { data } = yield call(userService.edit, payload.obj);
        if (data !== undefined
          && data.data !== undefined
          && data.data.head !== undefined
          && data.data.head.code === 200) {
          message.success('修改成功！');
          yield put(routerRedux.push('/user'));
        } else {
          message.error(data.data.head.msg);
        }
      }
    },
    *registerAndCreate({ payload }, { call, put }) {
      console.log(payload.oper);
      if (payload.oper === 'add') {
        const { data } = yield call(userService.register, payload.obj);
        if (data !== undefined
            && data.data !== undefined
            && data.data.head !== undefined
            && data.data.head.code === 200) {
          message.success('注册成功！');
          yield put(routerRedux.push({ pathname: '/user/register', query: { type: 'add' } }));
        } else {
          message.error(data.data.head.msg);
        }
      } else {
        const { data } = yield call(userService.edit, payload.obj);
        if (data !== undefined
          && data.data !== undefined
          && data.data.head !== undefined
          && data.data.head.code === 200) {
          message.success('修改成功！');
          yield put(routerRedux.push({ pathname: '/user/register', query: { type: 'add' } }));
        } else {
          message.error(data.data.head.msg);
        }
      }
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/user/register') {
          if (query.type === 'edit') {
            dispatch({ type: 'initEdit', payload: query });
          } else {
            dispatch({ type: 'initCreate', payload: query });
          }
        }else{
          dispatch({
            type: 'assignState',
            payload: Object.assign({}, initialState)
          })
        }
      });
    },
  },
});
