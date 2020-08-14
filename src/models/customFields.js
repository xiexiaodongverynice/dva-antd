/**
 * Created by Administrator on 2017/5/16 0016.
 */
import pathToRegexp from 'path-to-regexp';
import _ from 'lodash';
import * as customFieldsService from '../services/customFields';

function* fetchList({ payload = {} }, { call, put, select }) {
  const state = yield select(state => state.customFields);
  const response = yield call(customFieldsService.fetchWithPage, Object.assign({}, _.pick(state, ['pageNo', 'pageSize', 'label', 'objId']), payload));
  yield put({
    type: 'save',
    payload: {
      body: response.data,
    },
  });
}

const initialState = {
  objId: null,
  body: {
    result: [],
  },
  pageNo: 1,
  pageSize: 10,
  resultCount: 0,
  loading: true,
  label: '',
}

export default {
  namespace: 'customFields',
  state: Object.assign({}, initialState),
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    save(state, { payload: { body } }) {
      const { pageNo, resultCount, pageSize } = body;
      return { ...state, body, pageNo, resultCount, pageSize };
    },
  },
  effects: {
    *remove({ payload: { objId, id } }, saga) {
      const { call } = saga;
      const { data } = yield call(customFieldsService.remove, { objId, id });
      if (data) {
        yield fetchList({}, saga);
      }
    },

    *patch({ payload: { id, values } }, saga) {
      const { call } = saga;
      const { data } = yield call(customFieldsService.patch, id, values);
      if (data) {
        yield fetchList({}, saga);
      }
    },
    *put({ payload: { objId, id, values } }, saga) {
      const { call } = saga;
      const { data } = yield call(customFieldsService.put, { objId, id, values });
      if (data) {
        yield fetchList({}, saga);
      }
    },
    *create({ payload: { objId, values } }, saga) {
      const { call } = saga;
      const { data } = yield call(customFieldsService.create, { objId, values });
      if (data) {
        yield fetchList({}, saga);
      }
    },
    // 请求分页数据
    *fetch({ payload }, saga) {
      yield fetchList({ payload }, saga);
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        const match = pathToRegexp('/customObjects/:id/fields').exec(pathname);
        if (match) {
          const objId = match[1];
          dispatch({
            type: 'updateState',
            payload: {
              objId,
            },
          });
          dispatch({
            type: 'fetch',
          });
        }else{
          dispatch({
            type: 'updateState',
            payload: Object.assign({}, initialState)
          })
        }
      });
    },
  },
};
