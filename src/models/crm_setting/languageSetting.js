import { message } from 'antd';
import pathToRegexp from 'path-to-regexp';
import * as tenantSettingService from '../../services/tenantSetting';

const defaultLanguageSetting = {
  api_name: 'default_language',
  value: 'zh_cn',
};

export default {
  namespace: 'crm_language_setting',
  state: {
    language_setting: defaultLanguageSetting,
    loading: true,
  },
  reducers: {
    save(state, { payload: { language_setting } }) {
      return { ...state, language_setting };
    },
  },
  effects: {
    *fetchLanguageSetting({ payload }, { call, put }) {
      try {
        const setting_name = 'default_language';
        const response = yield call(tenantSettingService.fetchSetting, setting_name);
        const default_language = response.data.data.body;
        const languageSetting = { ...defaultLanguageSetting, ...default_language };
        yield put({
          type: 'save',
          payload: {
            language_setting: languageSetting,
          },
        });
      } catch (ex) {
        console.error(ex);
        message.error('获取默认语言设置失败');
      }
    },
    *saveOrUpdate({ payload }, { call, put }) {
      const response = yield call(tenantSettingService.createOrUpdate, payload);
      try {
        const language_setting = response.data.data.body;
        yield put({
          type: 'save',
          payload: {
            language_setting,
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
        const match = pathToRegexp('/languageSetting').exec(pathname);

        if (match) {
          dispatch({
            type: 'fetchLanguageSetting',
            payload: {},
          });
        }
      });
    },
  },
};
