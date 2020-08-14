import { message } from 'antd';
import _ from 'lodash';
import { redirectToList, saveData } from '../utils/custom_util';
import * as baseModel from './base';
import * as paginationModel from './pagination';
import mixinModels from '../libs/mixinModels';
import * as dutiessService from '../services/duty';

// 12/01/2018 - TAG: 获取数据列表
function* fetchList({ payload = {} }, { call, put, select }) {
  const state = yield select(state => state.dutiess);
  const { data } = yield call(dutiessService.fetch, Object.assign({}, _.pick(state, ['pageNo', 'pageSize', 'order', 'orderBy', 'name']), payload));
  yield saveData(data, { put });
}

const craftEmptyObjectt = () => {
  return {
    id: '',
    name: '',
    external_id: '',
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
  duties: craftEmptyObjectt(),
}

export default mixinModels(baseModel, paginationModel, {
  namespace: 'dutiess',
  state: Object.assign({}, initialState),
  reducers: {
  },
  effects: {
    *fetch({ payload }, saga) {
      yield fetchList({ payload }, saga);
    },
    *create({ payload: values }, { call, put }) {
      const { data } = yield call(dutiessService.create, values);
      yield redirectToList(data, '/duties', { put }, { msg: '创建成功!' });
    },
    // 12/01/2018 - TAG: 保存不跳转
    *creates({ payload: values }, { call, put }) {
      const { data } = yield call(dutiessService.create, _.omit(values, ['form']));
      if (data) {
        message.success('保存成功!');
        yield put({
          type: 'assignState',
          payload: craftEmptyObjectt(),
        });
        const { form = { resetFields: () => {} } } = values;
        form.resetFields();
      }
    },
    *editduties({ payload: values }, { call, put }) {
      const { data } = yield call(dutiessService.Edit, values);
      yield redirectToList(data, '/duties', { put }, { msg: '修改成功!' });
    },
    *onedutiess({ payload: { id } }, { call, put }) {
      yield put({
        type: 'assignState',
        payload: {
          duties: craftEmptyObjectt(),
        },
      });
      if (id) {
        const { data } = yield call(dutiessService.oneduty, { id });
        if (data) {
          yield put({
            type: 'assignState',
            payload: {
              duties: _.get(data, 'data.body'),
            },
          });
        }
      }
    },
    *delduties({ payload: { id } }, { call, put }) {
      const { data } = yield call(dutiessService.delduty, { id });
      yield redirectToList(data, '/duties', { put }, { msg: '删除成功!' });
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (/^\/duties\/?$/.test(pathname)) {
          dispatch({
            type: 'fetch',
            payload: query,
          });
        } else if (/^\/duties\/(add|edit)\/?$/.test(pathname)) {
          dispatch({
            type: 'onedutiess',
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
