import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as userService from '../services/user';
import * as baseModel from './base';
import mixinModels from '../libs/mixinModels';

const initialState = {
  body: { result: [] },
  head: {},
  groupList: [],
  logList: [],
}

// subscriptions -> effects -> reducers
export default mixinModels(baseModel, {
  namespace: 'detail',
  state: Object.assign({}, initialState),
  reducers: {
    save(state, { payload: { body, head, groupList, logList } }) {
      return { ...state, body, head, groupList, logList };
    },
  },
  effects: {
    // 页面初始化
    *fetch({ payload }, { call, put }) {
      // 根据id取得用户信息
      let body = {};
      let head = {};
      // 根据用户id取得登录信息
      let logList = [];
      // 根据用户id取得权限信息
      let groupList = [];
      const { data } = yield call(userService.getUserDetailByUserId, payload);
      if (data && data.data) {
        body = data.data.body;
        head = data.data.head;
        logList = body.login_log;
        groupList = body.permission_set;
      }
      yield put({
        type: 'save',
        payload: { body, head, groupList, logList },
      });
    },
    // 删除用户权限组
    *removeGroup({ payload }, { call, put }) {
      const { data } = yield call(userService.removeGroupByUserPermissionSet, payload);
      if (data.data.head.code === 200) {
        message.success('删除成功！');
        // 重新加载页面
        yield put(routerRedux.push({ pathname: '/user/detail', query: { id: payload.userId } }));
      } else {
        message.error(data.data.head.msg);
      }
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/user/detail') {
          dispatch({ type: 'fetch', payload: query });
        } else if (pathname === 'user/removeGroup') {
          dispatch({ type: 'removeGroup', payload: query });
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
