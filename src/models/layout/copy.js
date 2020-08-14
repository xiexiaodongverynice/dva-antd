import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as layoutService from '../../services/layout';
import mixinModels from '../../libs/mixinModels';
import base, * as baseModel from '../base';
import * as createEffect from './createEffect';
import { omitProps } from './helper';

// 19/01/2018 - TAG: 创建临时空对象
const craftEmptyObject = () => {
  return {
    api_name: '',
    display_name: '',
  };
};

export default mixinModels(baseModel, createEffect, {
  namespace: 'copyLayout',
  state: {
    temp: craftEmptyObject(), // 18/01/2018 - TAG: 临时对象，用以同步输入框,
    layout: { // 18/01/2018 - TAG: 布局预览对象

    },
    loading: false,
  },
  reducers: {
    // 18/01/2018 - TAG: 同时更新更改内容到temp临时对象和布局预览对象中
    updateTemp: (state, { payload }) => {
      const temp = Object.assign({}, state.temp, payload);
      return { ...state, temp, layout: Object.assign({}, state.layout, temp) };
    }
  },
  effects: {
    *loadById({ payload }, { call, put }) {
      const { data } = yield call(layoutService.loadById, payload);
      if (data) {
        yield put({
          type: 'assignState',
          payload: {
            layout: _.omit(Object.assign({}, _.get(data, 'data.body'), craftEmptyObject()), omitProps),
            loading: false,
          },
        });
      }
    },
  },

  // 路由监听器
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/layouts/copy') {
          dispatch({ type: 'loadById', payload: query.id });
        }
      });
    },
  },
});
