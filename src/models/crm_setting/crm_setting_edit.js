import { message } from 'antd';
import pathToRegexp from 'path-to-regexp';
import * as tenantSettingService from '../../services/tenantSetting';

export default {
  namespace: 'crm_setting_edit',
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
    *fetchSetting({ payload: { api_name } }, { call, put }) {
      const resp = yield call(tenantSettingService.fetchSetting, api_name);
      if (resp.data.data.head.code === 200) {
        yield put({
          type: 'save',
          payload: {
            body: resp.data.data.body,
          },
        });
      }
    },
    *create({ payload }, { call, put }) {
      console.log('*create', payload);
    },
    *update({ payload }, { call, put }) {
      const resp = yield call(tenantSettingService.updateSetting, payload);
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
      return history.listen(({ pathname, query }) => {
        const match = pathToRegexp('/crm_setting/edit').exec(pathname);
        const { api_name = '' } = query;
        if (match) {
          dispatch({
            type: 'fetchSetting',
            payload: {
              api_name,
            },
          });
        }
      });
    },
  },
};
