/**
 * Created by xinli on 06/06/2017.
 */
import { message } from 'antd';
import * as service from '../../services/translation';

export default {
  namespace: 'translation_edit',
  state: {
    translation: {},
  },
  reducers: {
    save(state, { payload: { translation } }) {
      return { ...state, translation };
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const { id } = payload;
      const { data } = yield call(service.fetchById, id);
      if (data) {
        if (!data.data.body) {
          data.data.body.items = {};
        }
        yield put({
          type: 'save',
          payload: {
            translation: data.data.body,
          },
        });
      }
    },
    *update({ payload: values }, { call, put }) {
      const { data } = yield call(service.update, values);
      if (data) {
        yield put({
          type: 'save',
          payload: {
            translation: data.data.body,
          },
        });
        message.success('保存成功');
      }
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/translation/edit') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};
