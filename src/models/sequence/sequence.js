import { hashHistory } from 'dva/router';
import { message } from 'antd';
import _ from 'lodash';
import * as sequenceService from '../../services/sequence';


function* fetchList({ payload = {} }, { call, put }) {
  const { data } = yield call(sequenceService.fetch);
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
  sequence: {
    label: '',
    api_name: '',
    increment: 1,
    min_value: 1,
    max_value: 9999,
    start_value: 1,
  },
  customObjects: [],
  group: {
    id: '',
    name: '',
    describe: '',
  },
  selectedObjectApiName: '',
};


export default {
  namespace: 'sequence',
  state: Object.assign({}, initialState),
  reducers: {
    save(state, { payload: { body } }) {
      return { ...state, body };
    },
    saveSequence(state, { payload: { sequence } }) {
      return { ...state, sequence };
    },
    saveCurrentValue(state, { payload: { current_value } }) {
      const { sequence } = state;
      return { ...state, sequence: { ...sequence, current_value } };
    },
    Role(state, { payload: { group } }) {
      return { ...state, group };
    },
    fetchCustomObjectsSuccess(state, { payload: { customObjects } }) {
      return { ...state, customObjects };
    },
    changeSelectedObjectDescribe(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    // 获取数据列表
    *fetch({ payload }, { call, put }) {
      yield fetchList({ payload }, { call, put });
    },
    *create({ payload: values }, { call }) {
      const { data } = yield call(sequenceService.create, values);
      if (data == false) { 
        return;
      }
      if (data.data.head.code === 200) {
        message.success('保存成功');
        hashHistory.push('/sequence');
      } else {
        message.error('保存失败');
      }
    },
    *deleteSequence({ payload: { id } }, { call, put }) {
      const { data } = yield call(sequenceService.deleteSequence, { id });
      if (data) {
        yield fetchList({}, { call, put });
        message.success('删除成功');
      }
    },
    *updateSequence({ payload: { sequence } }, { call, put }) {
      const { data } = yield call(sequenceService.updateSequence, sequence);
      if (data.data.head.code === 200) {
        message.success('保存成功');
        yield put({
          type: 'saveSequence',
          payload: {
            sequence: data.data.body,
          },
        });
      } else {
        message.error('保存失败');
      }
    },
    *resetSequence({ payload }, { call, put }) {
      const { data } = yield call(sequenceService.resetSequence, payload);
      if (data) {
        console.log(data.data.body.new_value);
        yield put({
          type: 'saveCurrentValue',
          payload: {
            current_value: data.data.body.new_value,
          },
        });
        message.success('保存成功');
      }
    },
    *fetchSequence({ payload: { id } }, { call, put }) {
      const { data } = yield call(sequenceService.fetchSequence, id);
      if (data) {
        yield put({
          type: 'saveSequence',
          payload: {
            sequence: data.data.body,
          },
        });
      }
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/sequence') {
          dispatch({ type: 'fetch', payload: query });
        }
        if (pathname === '/sequence/edit' || pathname === '/sequence/reset') {
          dispatch({ type: 'fetchSequence', payload: query });
        }
      });
    },
  },
};
