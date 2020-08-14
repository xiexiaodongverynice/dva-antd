import { hashHistory } from 'dva/router';
import { message } from 'antd';
import pathToRegexp from 'path-to-regexp';
import _ from 'lodash';
import * as objectService from '../services/customObjects'


function* fetchList({ payload = {} }, { call, put }) {
  const { data } = yield call(objectService.fetch);
  if (data) {
    const body = _.chain(data).result('data').result('body', {}).value();
    const { items = [] } = body;
    yield put({
      type: 'save',
      payload: Object.assign({}, {
        body: items,
      }, payload),
    });
  }
}


const initialState = {
  object: {
    name: '',
    api_name: '',
    api_version: '',
    description: '',
    script: '',
    script_type: 0,
    actions: {},
  },
};


export default {
  namespace: 'custom_action',
  state: Object.assign({}, initialState),
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *update({ payload: { object } }, { call, put }) {
      const { data } = yield call(objectService.put, object.id, object);
      if (data) {
        message.success('保存成功');
        yield put({
          type: 'save',
          payload: {
            object: data,
          },
        });
      } else {
        message.error('保存失败');
      }
    },
    *fetchObjectByApiName({ payload }, { call, put }) {
      const { data } = yield call(objectService.fetchByApiName, payload, false);
      if (data) {
        yield put({
          type: 'save',
          payload: {
            object: data,
          },
        });
      }
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname}) => {
        const match = pathToRegexp('/customObjects/:objectDescribeApiName/actions').exec(pathname);
        if (match) {
          dispatch({
            type: 'fetchObjectByApiName',
            payload: {
              object_api_name: match[1],
            },
          });
        }
      });
    },
  },
};
