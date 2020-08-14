import pathToRegexp from 'path-to-regexp';
import * as objectPageIndexService from '../../services/object_page/index';
import * as describeService from '../../services/customObjects';

// subscriptions -> effects -> reducers
export default {
  namespace: 'object_page',
  state: {
    layout: null,
    describe: {},
    loading: true,
  },
  reducers: {
    layout(state, { payload: { layout } }) {
      return { ...state, layout };
    },

    describe(state, { payload: { describe } }) {
      return { ...state, describe };
    },
  },
  effects: {
    *fetchLayout({ payload }, { call, put }) {
      console.log('获取数据');
      const { data } = yield call(objectPageIndexService.fetch, payload);
      const layout = data.data.body;
      // console.log(payload)
      // console.log(data)
      yield put({
        type: 'layout',
        payload: { layout },
      });
    },
    *fetchDescribe({ payload }, { call, put }) {
      const { data } = yield call(describeService.fetchByApiName, payload);
      // console.log(data);
      yield put({
        type: 'describe',
        payload: { describe: data },
      });
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      console.log('路由监听');
      return history.listen(({ pathname }) => {
        const match = pathToRegexp('/object_page/:object_api_name/index_page').exec(pathname);
        if (match) {
          dispatch({ type: 'fetchLayout', payload: { object_api_name: match[1], layout_type: 'index_page' } });
          // dispatch({ type: 'fetchDescribe', payload: {object_api_name : match[1]}});
        }
      });
    },
  },
};
