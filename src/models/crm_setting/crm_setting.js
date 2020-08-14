import { message } from 'antd';
import pathToRegexp from 'path-to-regexp';
import * as tenantSettingService from '../../services/tenantSetting';

export default {
  namespace: 'crm_setting',
  state: {
    body: {},
    loading: false,
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *fetchAllSetting({ payload }, { call, put }) {
      const resp = yield call(tenantSettingService.fetchAll, payload);
      if (resp.data.data.head.code === 200) {
        yield put({
          type: 'save',
          payload: {
            body: resp.data.data.body,
          },
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        const match = pathToRegexp('/crm_setting/index').exec(pathname);

        if (match) {
          dispatch({
            type: 'fetchAllSetting',
            payload: {},
          });
        }
      });
    },
  },
};
