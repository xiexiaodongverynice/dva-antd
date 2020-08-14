/**
 * Created by xinli on 06/08/2017.
 */
import { message } from 'antd';
import * as kpiDefService from '../../services/kpiDef';

const initialState = {
  list: [],
};

export default {
  namespace: 'kpi_def_list',
  state: initialState,
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
      const response = yield call(kpiDefService.fetch, {});
      if(response){
        yield put({
          type: 'save',
          payload: { list: _.get(response, 'data.data.body.result'), loading: false },
        });
      }
    },

    *deleteItem({ payload }, { call, put }) {
      const { id } = payload;
      const { data } = yield call(kpiDefService.deleteItem, id);
      if (data) {
        yield put({
          type: 'del',
          payload: {
            id,
          },
        });
        message.success('删除成功');
      }
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/kpi_def/list') {
          dispatch({ type: 'fetch' });
        }else{
          dispatch({
            type: 'assignState',
            payload: initialState,
          });
        }
      });
    },
  },
};
