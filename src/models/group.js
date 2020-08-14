import _ from 'lodash';
import { redirectToList, saveData } from '../utils/custom_util';
import * as baseModel from './base';
import * as paginationModel from './pagination';
import mixinModels from '../libs/mixinModels';
import * as groupsService from '../services/group';

// 12/01/2018 - TAG: 获取数据列表
function* fetchList({ payload = {} }, { call, put, select }) {
  const state = yield select(state => state.groups);
  const { data } = yield call(groupsService.fetch, Object.assign({}, _.pick(state, ['pageNo', 'pageSize', 'order', 'orderBy', 'name']), payload));
  yield saveData(data, { put });
}

const craftEmptyObject = () => {
  return {
    id: '',
    label: '',
    describe: '',
  };
};

const initialState = {
  body: [],
  pageNo: 1,
  pageSize: 10,
  resultCount: 0,
  name: null,
  order: 'desc',
  orderBy: 'name',
  group: craftEmptyObject(),
  copyGroup: craftEmptyObject(),
}

export default mixinModels(baseModel, paginationModel, {
  namespace: 'groups',
  state: Object.assign({}, initialState),
  reducers: {
  },
  effects: {
    *fetch({ payload }, saga) {
      yield fetchList({ payload }, saga);
    },
    *edit({ payload: query }, { put }) {
      yield put({
        type: 'assignState',
        payload: {
          copyGroup: query,
        },
      });
    },
    *create({ payload: values }, { call, put }) {
      const { data } = yield call(groupsService.Create, values);
      yield redirectToList(data, '/group', { put }, { msg: '创建成功!' });
    },
    *delGroup({ payload: { id } }, { call, put }) {
      const { data } = yield call(groupsService.DelGroup, { id });
      yield redirectToList(data, '/group', { put }, { msg: '删除成功!' });
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/group') {
          dispatch({
            type: 'fetch',
            payload: query,
          });
        }else if (pathname === '/group/copy') {
          dispatch({
            type: 'edit',
            payload: query,
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
