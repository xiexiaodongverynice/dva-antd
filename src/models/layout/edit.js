import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as layoutService from '../../services/layout';
import mixinModels from '../../libs/mixinModels';
import * as baseModel from '../base';

export default mixinModels(baseModel, {
  namespace: 'editLayout',
  state: {
    layout: {
      object_describe_api_name: '',
      layout_type: '',
      display_name: '',
      layout: 'one_column',
      api_name: '',
    },
    loading: false,
  },
  reducers: {
  },
  effects: {
    *loadById({ payload }, { call, put }) {
      const { data } = yield call(layoutService.loadById, payload);
      if (data) {
        yield put({
          type: 'assignState',
          payload: {
            layout: _.get(data, 'data.body'),
            loading: false,
          },
        });
      }
    },

    *updateLayout({ payload }, { call, put }) {
      const { data } = yield call(layoutService.updateLayout, payload);
      if (data) {
        yield put({
          type: 'assignState',
          payload: {
            layout: _.get(data, 'data.body'),
          },
        });
        message.success('修改成功');
      }
    },
  },

  // 路由监听器
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/layouts/edit') {
          dispatch({ type: 'loadById', payload: query.id });
        }
      });
    },
  },
});
