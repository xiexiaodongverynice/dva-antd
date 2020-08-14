/**
 * Created by xinli on 06/06/2017.
 */
import { hashHistory } from 'dva/router';
import { message } from 'antd';
import * as service from '../../services/translation';

export default {
  namespace: 'translation_add',
  state: {
    translation: {
      api_name: '',
      resource: '',
    },
  },
  reducers: {
    save(state, { payload: { translation } }) {
      return { ...state, translation };
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      if (payload.copy) {
        const { data } = yield call(service.fetchById, payload.copy);
        // console.log('fetch', data);

        if (data.data.body) {
          const copy = data.data.body;
          yield put({
            type: 'save',
            payload: {
              translation: {
                resource: copy.resource,
              },
            },
          });
        }
      } else {
        yield put({
          type: 'save',
          payload: {
            translation: {
              resource: '',
              api_name: '',
            },
          },
        });
      }
    },
    *create({ payload: values }, { call, put }) {
      const { data } = yield call(service.create, values);
      if (data) {
        yield put({ type: 'fetch' });
        message.success('保存成功');
        hashHistory.push(`/translation/edit?id=${data.data.body.id}`);
      }
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/translation/add') {
          if (query.copy) {
            dispatch({ type: 'fetch', payload: query });
          }
        }
      });
    },
  },
};
