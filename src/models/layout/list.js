/**
 * Created by xinli on 06/08/2017.
 */
import { message } from 'antd';
import * as layoutService from '../../services/layout';
import * as baseModel from '../base';
import mixinModels from '../../libs/mixinModels';

const initialState = {
  layoutList: [],
  loading: true,
};

export default mixinModels(baseModel, {
  namespace: 'layoutList',
  state: Object.assign({}, initialState),
  reducers: {
    del: (state, id) => {
      const { layoutList } = state;
      const current = id.payload.id;
      const newLayoutList = layoutList.filter((item) => {
        return item.id !== current;
      });
      return {
        ...state,
        layoutList: newLayoutList,
      };
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const { data } = yield call(layoutService.fetch, {});
      const response = data;
      yield put({
        type: 'assignState',
        payload: { layoutList: response.data.body.items, loading: false },
      });
    },

    // 删除布局
    *deleteLayout({ payload }, { call, put }) {
      const { id } = payload;
      const { data } = yield call(layoutService.deleteLayout, id);
      if (data) {
        yield put({
          type: 'del',
          payload: {
            id,
          } });
        message.success('删除成功');
      }
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/layouts/list') {
          dispatch({ type: 'fetch', payload: { pageNo: 1, pageSize: 10 } });
        }else{
          dispatch({
            type: 'save',
            payload: Object.assign({}, initialState)
          })
        }
      });
    },
  },
});
