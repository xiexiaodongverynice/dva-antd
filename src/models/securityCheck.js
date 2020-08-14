import { hashHistory } from 'dva/router';
import { message } from 'antd';
import _ from 'lodash';
import * as securityCheckService from '../services/securityCheck';

function* fetchList({ payload = {} }, { call, put }) {
  const { data } = yield call(securityCheckService.fetch);
  if (data) {
    const body = _.chain(data).result('data').result('body', {}).value();
    const { items = [] } = body;
    // const items = _.get(data,'data.body.items', []);
    const needShowEnableButton = _.isEmpty(items);
    yield put({
      type: 'success',
      payload: Object.assign({}, {
        body: items,
        needShowEnableButton,
      }, payload),
    });
  }
}


const initialState = {
  body: [],
  object_describes: [],
  record: {},
  needShowEnableButton: true,
  showInitModal: false,
  modalDistributionVisible: false,
  confirmLoading: false,
};


export default {
  namespace: 'security_check',
  state: Object.assign({}, initialState),
  reducers: {
    success(state, { payload }) {
      return { ...state, ...payload };
    },
    saveSecurityCheck(state, { payload: { record } }) {
      return { ...state, record };
    },
    changeConfirmLoading(state, { payload }) {
      const { confirmLoading = false } = payload;
      return { ...state, confirmLoading };
    },
  },
  effects: {
    // 获取数据列表
    *fetch({ payload }, { call, put }) {
      yield fetchList({ payload }, { call, put });
    },
    *create({ payload: values }, { call }) {
      const response = yield call(securityCheckService.create, values);
      if (_.get(response, 'data.data.head.code') === 200) {
        message.success('保存成功');
        hashHistory.push('/security_check/index');
      } else {
        // message.error('保存失败');
      }
    },
    *remove({ payload: { id } }, { call, put }) {
      const { data } = yield call(securityCheckService.remove, { id });
      if (data) {
        yield fetchList({}, { call, put });
        message.success('删除成功');
      }
    },
    *update({ payload: { security_check }, callback }, { call, put }) {
      const response = yield call(securityCheckService.update, security_check);
      if (_.get(response, 'data.data.head.code') === 200) {
        message.success('保存成功');
        yield put({
          type: 'saveSecurityCheck',
          payload: {
            record: _.get(response, 'data.data.body'),
          },
        });
        if (callback)callback();
      } else {
        message.error('保存失败');
      }
    },
    *fetchById({ payload: { id } }, { call, put }) {
      const response = yield call(securityCheckService.fetchById, id);
      yield put({
        type: 'success',
        payload: {
          record: _.get(response, 'data.data.body'),
        },
      });
    },
    *initCreatePage({ payload }, { call, put }) {
      yield put({
        type: 'saveSecurityCheck',
        payload: {
          record: {},
        },
      });
    },
    *initSecurityCheck({ payload }, { call, put }) {
      yield put({
        type: 'success',
        payload: {
          showInitModal: false,
        },
      });
      const response = yield call(securityCheckService.init, {});
      if (_.get(response, 'data.data.head.code') === 200) {
        yield put({
          type: 'fetch',
          payload: {},
        });
        message.success('安全策略初始化成功!');
      }
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/security_check/index') {
          dispatch({ type: 'fetch', payload: query });
        }
        if (pathname === '/security_check/edit') {
          console.log('edit page');
          dispatch({ type: 'fetchById', payload: query });
        }
        if (pathname === '/security_check/add') {
          console.log('add page');
          dispatch({
            type: 'initCreatePage',
            payload: {},
          });
        }
      });
    },
  },
};
