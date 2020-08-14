import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as layoutAssignService from '../../services/layoutAssign';

export default {
  namespace: 'layout_assign',
  state: {
    layout_assign: {
      object_describe_api_name: '',
      layout_type: '',
      api_name: '',
      profile: '',
      record_type: '',
      layout_name: '',
    },
    loading: false,
  },
  reducers: {
    save: (state, { payload }) => {
      const newState = { ...state, ...payload };
      return newState;
    },
  },
  effects: {
    *loadById({ payload }, { call, put }) {
      const response = yield call(layoutAssignService.loadById, payload);
      yield put({
        type: 'save',
        payload: {
          layout_assign: response.data.data.body,
          loading: false,
        },
      });
    },

    *createOrUpdate({ payload }, { call, put }) {
      const { data } = yield call(layoutAssignService.createOrUpdate, payload);
      yield put({
        type: 'save',
        payload: {
          layout_assign: data.data.body,
        },
      });
      message.success('修改成功');
      // yield put(routerRedux.push('/layout_assign/list'));
    },

    // 删除布局分配
    *del({ payload }, { call, put }) {
      const { data } = yield call(layoutAssignService.deleteLayoutAssign, payload);
      if (data) {
        yield put({
          type: 'fetch',
          payload: {
            id: payload,
          } });
        message.success('删除成功');
        yield put(routerRedux.push('/layout_assign/list'));
      }
    },
  },

  // 路由监听器
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/layout_assign/edit') {
          dispatch({ type: 'loadById', payload: query.id });
        }
        if (pathname === '/layout_assign/add') {
          dispatch({
            type: 'save',
            payload: {
              layout_assign: {
                object_describe_api_name: '',
                layout_type: '',
                api_name: '',
                profile: '',
                record_type: '',
                layout_name: '',
              },
            },
          });
        }
      });
    },
  },
};
