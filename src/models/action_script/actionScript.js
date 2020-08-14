import { hashHistory } from 'dva/router';
import { message } from 'antd';
import _ from 'lodash';
import * as actionScriptService from '../../services/actionScript';


function* fetchList({ payload = {} }, { call, put }) {
  const { data } = yield call(actionScriptService.fetch);
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
  body: [],
  action_script: {
    name: '',
    api_name: '',
    api_version: '',
    description: '',
    script: '',
    script_type: 0,
  },
};


export default {
  namespace: 'action_script',
  state: Object.assign({}, initialState),
  reducers: {
    save(state, { payload: { body } }) {
      return { ...state, body };
    },
    saveActionScript(state, { payload: { action_script } }) {
      return { ...state, action_script };
    },
    saveCurrentValue(state, { payload: { current_value } }) {
      const { action_script } = state;
      return { ...state, sequence: { ...action_script, current_value } };
    },
  },
  effects: {
    // 获取数据列表
    *fetch({ payload }, { call, put }) {
      yield fetchList({ payload }, { call, put });
    },
    *create({ payload: values }, { call }) {
      const { data } = yield call(actionScriptService.create, values);
      if (data) {
        message.success('保存成功');
        hashHistory.push('/action_script');
      }
    },
    *remove({ payload: { id } }, { call, put }) {
      const { data } = yield call(actionScriptService.remove, { id });
      if (data) {
        yield fetchList({}, { call, put });
        message.success('删除成功');
      }
    },
    *update({ payload: { action_script } }, { call, put }) {
      const { data } = yield call(actionScriptService.update, action_script);
      if (data.data.head.code === 200) {
        message.success('保存成功');
        yield put({
          type: 'saveActionScript',
          payload: {
            action_script: data.data.body,
          },
        });
      } else {
        message.error('保存失败');
      }
    },
    *fetchById({ payload: { id } }, { call, put }) {
      const { data } = yield call(actionScriptService.fetchById, id);
      if (data) {
        yield put({
          type: 'saveActionScript',
          payload: {
            action_script: data.data.body,
          },
        });
      }
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/action_script') {
          dispatch({ type: 'fetch', payload: query });
        }
        if (pathname === '/action_script/edit') {
          dispatch({ type: 'fetchById', payload: query });
        }
      });
    },
  },
};
