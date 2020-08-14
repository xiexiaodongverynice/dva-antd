/**
 * Created by Administrator on 2017/5/16 0016.
 */
import _ from 'lodash';
import { message } from 'antd';
import * as customObjectsService from '../services/customObjects';
import * as approvalFlowService from '../services/approvalFlow';

function* fetchList({ payload = {} }, { call, put, select }) {
  const state = yield select(state => state.customObjects);
  const response = yield call(customObjectsService.fetchWithPage, Object.assign({}, _.pick(state, ['pageNo', 'pageSize', 'display_name', 'includeFields']), payload));
  yield put({
    type: 'save',
    payload: {
      body: response.data,
    },
  });
}

const initialState = {
  body: {
    result: [],
  },
  pageNo: 1,
  pageSize: 10,
  resultCount: 0,
  loading: true,
  display_name: '',
  includeFields: false,
};

export default {
  namespace: 'customObjects',
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
    // 删除已经创建的对象描述
    *remove({ payload: id }, saga) {
      const { call } = saga;
      const { data } = yield call(customObjectsService.remove, id);
      if (data) {
        yield fetchList({}, saga);
      }
    },
    // 少量更新对象描述
    *patch({ payload: { id, values } }, saga) {
      const { call } = saga;
      const { data } = yield call(customObjectsService.patch, id, values);
      if (data) {
        yield fetchList({}, saga);
      }
    },
    // 更新对象描述
    *put({ payload: { id, values } }, saga) {
      const { call } = saga;
      const { data } = yield call(customObjectsService.put, id, values);
      if (data) {
        yield fetchList({}, saga);
      }
    },
    // 创建对象描述
    *create({ payload: values }, saga) {
      const { call } = saga;
      const { data } = yield call(customObjectsService.create, values);
      if (data) {
        yield fetchList({}, saga);
      }
    },
    // 请求分页数据
    *fetch({ payload }, saga) {
      yield fetchList({ payload }, saga);
    },

    // 在对象上启用工作流
    *enableApprovalFlow({ payload }, saga) {
      const { call } = saga;
      const { data } = yield call(approvalFlowService.enableApprovalOnObject, payload);
      if (data.data.head.code === 200) {
        message.success('操作成功');
      } else {
        message.error('操作失败');
      }
      yield fetchList({}, saga);
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/customObjects') {
          dispatch({ type: 'fetch' });
        } else {
          dispatch({
            type: 'updateState',
            payload: Object.assign({}, initialState)
          });
        }
      });
    },
  },
};
