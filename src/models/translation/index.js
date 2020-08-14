/**
 * Created by xinli on 06/06/2017.
 */
import { message } from 'antd';
import * as service from '../../services/translation';

export default {
  namespace: 'translation_index',
  state: {
    translations: [],
    pageSize: 0,
  },
  reducers: {
    save(state, { payload: { translations, pageSize } }) {
      return { ...state, translations, pageSize };
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const { data } = yield call(service.fetch);
      if (data) {
        if (!data.data.body.items) {
          data.data.body.items = [];
        }
        yield put({
          type: 'save',
          payload: {
            translations: data.data.body.items,
            pageSize: data.data.body.size,
          },
        });
      }
    },
    *deleteTranslation({ payload: { id } }, { call, put }) {
      const { data } = yield call(service.del, { id });
      if (data) {
        yield put({ type: 'fetch', payload: {} });
        message.success('删除成功');
      }
    },
    *reload(action, { put, select }) {
      const pageNo = yield select(state => state.groups.page);
      yield put({ type: 'fetch', payload: { pageNo } });
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/translation') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};
