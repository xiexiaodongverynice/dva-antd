import pathToRegexp from 'path-to-regexp';
import * as baseModel from '../base';
import mixinModels from '../../libs/mixinModels';
import * as tenantSettingService from '../../services/tenantSetting';

const craftEmptyObject = () => {
  return {
    api_name: 'logo_setting',
    value: '',
  };
};

export default mixinModels(baseModel, {
  namespace: 'logo_setting',
  state: {
    data: craftEmptyObject(),
    uploadLogoUrl: tenantSettingService.uploadLogoUrl,
  },
  reducers: {

  },
  effects: {
    *fetch({payload}, {put, call}){
      try {
        const response = yield call(tenantSettingService.fetchSetting, 'logo_setting');
        if(response){
          const data = _.get(response, 'data.data.body');
          yield put({
            type: 'assignState',
            payload: {
              data: Object.assign({}, craftEmptyObject(), data),
            },
          });
        }
      }catch (ex) {
        console.error(ex);
        message.error('获取LOGO模板失败');
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        const match = pathToRegexp('/logoSetting').exec(pathname);
        if (match) {
          dispatch({
            type: 'fetch',
          });
        }
      });
    },
  },
});
