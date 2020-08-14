/**
 * Created by xinli on 06/06/2017.
 */
import { hashHistory } from 'dva/router';
import { message } from 'antd';
import _ from 'lodash';
import * as tabService from '../services/tab';
import { fetchCustomObjects } from '../services/customDetails';

function* fetchList({ payload = {} }, { call, put }) {
  const { data } = yield call(tabService.fetch, payload);
  if (data) {
    const body = _.chain(data)
      .result('data')
      .result('body', {})
      .value();
    const { items = [] } = body;
    yield put({
      type: 'save',
      payload: Object.assign(
        {},
        {
          body: items,
        },
        payload,
      ),
    });
  }
}

const initialState = {
  body: [],
  tab: {
    label: '',
    api_name: '',
    type: 'object_index', // 暂时只支持这一种
    object_describe_api_name: '',
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
  namespace: 'nav_tabs',
  state: Object.assign({}, initialState),
  reducers: {
    save(
      state,
      {
        payload: { body },
      },
    ) {
      return { ...state, body };
    },
    saveTab(
      state,
      {
        payload: { tab },
      },
    ) {
      return { ...state, tab };
    },
    Role(
      state,
      {
        payload: { group },
      },
    ) {
      return { ...state, group };
    },
    fetchCustomObjectsSuccess(
      state,
      {
        payload: { customObjects },
      },
    ) {
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
    *fetchCustomObjects({ payload }, { call, put }) {
      const { data } = yield call(fetchCustomObjects);
      if (data) {
        const body = _.chain(data)
          .result('data')
          .result('body', {})
          .value();
        const { items = [] } = body;
        yield put({
          type: 'fetchCustomObjectsSuccess',
          payload: {
            customObjects: items,
          },
        });
      }
    },
    *create({ payload: values }, { call }) {
      const { data } = yield call(tabService.create, values);
      if (data) {
        message.success('保存成功');
        hashHistory.push('/tabs');
      }
    },
    *deleteTab(
      {
        payload: { id },
      },
      { call, put },
    ) {
      const { data } = yield call(tabService.deleteTab, { id });
      if (data) {
        yield fetchList({}, { call, put });
        message.success('删除成功');
      }
    },
    *updateTab(
      {
        payload: { tab },
      },
      { call, put },
    ) {
      const { data } = yield call(tabService.updateTab, tab);
      if (data) {
        yield put({
          type: 'saveTab',
          payload: {
            tab: data.data.body,
          },
        });
        message.success('保存成功');
      }
    },
    *fetchTab(
      {
        payload: { id },
      },
      { call, put },
    ) {
      const { data } = yield call(tabService.fetchTab, id);
      if (data) {
        yield put({
          type: 'saveTab',
          payload: {
            tab: data.data.body,
          },
        });
      }
    },
    *updateTabs(
      {
        payload: { resultData },
      },
      { call, put },
    ) {
      const response = yield call(tabService.updateTabs, resultData);
      if (_.get(response, 'data.data.head.code') === 200) {
        message.success('保存成功');
        yield put({
          type: 'fetch',
          payload: {
            // record: _.get(response, 'data.data.body'),
          },
        });
        // if (callback)callback();
      } else {
        message.error('保存失败');
      }
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/tabs' || pathname === '/tabs/layout') {
          console.log('ready to fetch tabs==>', query);
          dispatch({ type: 'fetch', payload: query });
        } else {
          dispatch({
            type: 'changeSelectedObjectDescribe',
            payload: Object.assign({}, initialState),
          });
        }
      });
    },
  },
};
