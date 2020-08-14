/**
 * Created by xinli on 06/08/2017.
 */
import { message } from 'antd';
import * as layoutAssignService from '../../services/layoutAssign';

export default {
  namespace: 'layout_assign_list',
  state: {
    list: [],
  },
  reducers: {
    save: (state, { payload }) => {
      const newState = { ...state, ...payload };
      return newState;
    },
    del: (state, id) => {
      const { list } = state;
      const current = id.payload.id;
      const newList = list.filter((item) => {
        return item.id !== current;
      });
      return {
        ...state,
        list: newList,
      };
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const { data } = yield call(layoutAssignService.fetch, {});
      const response = data;
      yield put({
        type: 'save',
        payload: { list: response.data.body.items, loading: false },
      });
    },

    // 删除布局分配
    *deleteItem({ payload }, { call, put }) {
      const { id } = payload;
      const { data } = yield call(layoutAssignService.deleteLayoutAssign, id);
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
        if (pathname === '/layout_assign/list') {
          dispatch({ type: 'fetch', payload: { pageNo: 1, pageSize: 10 } });
        }
      });
    },
  },
};
