import { message } from 'antd';
import pathToRegexp from 'path-to-regexp';
import * as tenantSettingService from '../../services/tenantSetting';

const defaultAlertSetting = {
  api_name: 'alert_setting',
  value: '[]',
  send_email: false,  // 默认是hi不开启邮件发送功能的
};

export default {
  namespace: 'crm_alert_setting',
  state: {
    alert_setting: defaultAlertSetting,
    loading: true,
  },
  reducers: {
    save(state, { payload: { alert_setting } }) {
      return { ...state, alert_setting };
    },
  },
  effects: {
    *fetchAlertSetting({ payload }, { call, put }) {
      try {
        const response = yield call(tenantSettingService.fetchSetting, 'alert_setting');
        const alert_setting = response.data.data.body;
        yield put({
          type: 'save',
          payload: {
            alert_setting: Object.assign({ api_name: 'alert_setting', value: '' }, alert_setting),
          },
        });
      } catch (ex) {
        console.error(ex);
        message.error('获取通知模板失败');
      }
    },
    *saveOrUpdate({ payload }, { call, put }) {
      const response = yield call(tenantSettingService.createOrUpdate, payload);
      try {
        const alert_setting = response.data.data.body;
        yield put({
          type: 'save',
          payload: {
            alert_setting,
          },
        });
        message.success('保存成功');
      } catch (ex) {
        console.error(ex);
        message.error('保存失败');
      }
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        const match = pathToRegexp('/crm_alert').exec(pathname);

        if (match) {
          dispatch({
            type: 'fetchAlertSetting',
            payload: {},
          });
        }
      });
    },
  },
};
