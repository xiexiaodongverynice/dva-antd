import _ from 'lodash';
import * as baseModel from './base';
import * as paginationModel from './pagination';
import mixinModels from '../libs/mixinModels';
import * as userService from '../services/user';
import { redirectToList, saveData } from '../utils/custom_util';

// 04/01/2018 - TAG: 获取数据
function* fetchList({ payload = {} }, { call, put, select }) {
  const state = yield select(state => state.user);
  const { data } = yield call(userService.fetch, Object.assign({}, _.pick(state, ['pageNo', 'pageSize', 'order', 'orderBy', 'enable', 'name', 'nick_name']), payload));
  yield saveData(data, { put });
}

const initialState = {
  body: {
    result: [],
  },
  pageNo: 1,
  pageSize: 10,
  resultCount: 0,
  loading: true,
  order: 'asc',
  orderBy: 'name',
  enable: null,
  name: null,
  nick_name: null,
}

// subscriptions -> effects -> reducers
export default mixinModels(baseModel, paginationModel, {
  namespace: 'user',
  state: Object.assign({}, initialState),
  reducers: {
  },

  effects: {
    // 04/01/2018 - TAG: 获取数据
    *fetch({ payload }, saga) {
      yield fetchList({ payload }, saga);
    },
    // 04/01/2018 - TAG: 密码重置
    *reset({ payload }, { call, put }) {
      const { data } = yield call(userService.resetPassword, payload);
      yield redirectToList(data, '/user', { put }, { msg: '密码重置成功!' });
    },
    // 04/01/2018 - TAG: 用户激活
    *active({ payload }, { call, put }) {
      const { data } = yield call(userService.userActive, payload);
      yield redirectToList(data, '/user', { put }, { msg: '激活成功!' });
    },
    // 删除用户
    *deleteUser({ payload }, { call, put }) {
      const { id } = payload;
      const { data } = yield call(userService.deleteUser, id);
      yield redirectToList(data, '/user', { put }, { msg: '删除成功!' });
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/user') {
          dispatch({
            type: 'fetch',
          });
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
