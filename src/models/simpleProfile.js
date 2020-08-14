import _ from 'lodash';
import * as profileService from '../services/simpleProfile';
import { redirectToList, saveData } from '../utils/custom_util';
import * as baseModel from './base';
import * as paginationModel from './pagination';
import mixinModels from '../libs/mixinModels';

// 09/01/2018 - TAG: 获取列表数据
function* fetchList({ payload = {} }, { call, put, select }) {
  const state = yield select(state => state.profile);
  const { data } = yield call(profileService.getSimpleProfile, Object.assign({}, _.pick(state, ['pageNo', 'pageSize', 'order', 'orderBy', 'name']), payload));
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
  viewType: false,
  name: null,
  order: 'asc',
  orderBy: 'name',
}

export default mixinModels(baseModel, paginationModel, {
  namespace: 'profile',
  state: Object.assign({}, initialState),
  reducers: {
  },
  effects: {
    *fetch({ payload }, saga) {
      yield fetchList({ payload }, saga);
    },
    *search({ payload }, saga) {
      yield fetchList({ payload }, saga);
    },
    *deleteProfile({ payload }, { call, put }) {
      const { data } = yield call(profileService.deleteSimpleProfile, payload);
      yield redirectToList(data, '/profile', { put }, { msg: '删除成功!' });
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/profile') {
          dispatch({
            type: 'fetch',
          });
        }else{
          dispatch({
            type: 'assignState',
            payload: Object.assign({}, initialState),
          })
        }
      });
    },
  },
});
