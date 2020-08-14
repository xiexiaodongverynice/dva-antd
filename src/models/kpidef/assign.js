
import mixinModels from '../../libs/mixinModels';
import * as kpiDefService from '../../services/kpiDef';
import * as baseModel from '../base';
import { message } from 'antd';
import _ from 'lodash';
import * as profileServies from '../../services/simpleProfile';

const initialState = {
  list: [],
  targetKeys: [],
  selectedKeys: [],
  apiName: null,
};

export default mixinModels(baseModel, {
  namespace: 'kpi_def_assign',
  state: initialState,
  reducers: {},
  effects: {
    *fetch({payload}, { select, put, call }){
      const { apiName } = yield select(state => state.kpi_def_assign);
      const profilesResponse = yield call(profileServies.getSimpleProfileList, {});
      let profiles;
      let selectedProfiles;
      if(profilesResponse){
        profiles = _.get(profilesResponse, 'data.data.body.result');
      }
      // 获取跟此kpi有关的额简档
      const selectedProfilesResponse = yield call(kpiDefService.listProfiles, apiName);
      if(selectedProfilesResponse){
        selectedProfiles = _.get(selectedProfilesResponse, 'data.data.body.result');
        // 过滤掉无效的简档
        selectedProfiles = selectedProfiles.filter(item => _.findIndex(profiles, { api_name: item.profile_api_name }) !== -1);
      }
      yield put({
        type: 'assignState',
        payload: {
          list: profiles.map(item => {
            return {
              key: item.api_name,
              title: item.name,
            };
          }),
          targetKeys: selectedProfiles.map(item => item.profile_api_name),
        },
      });
    },

    *save({payload}, {select, put, call}){
      const { apiName, targetKeys } = yield select(state => state.kpi_def_assign);
      const response = yield call(kpiDefService.updateAssign, apiName, targetKeys);
      if(response){
        message.info(_.get(response, 'data.data.head.msg'));
      }
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname, state }) => {
        if (/\/kpi_def\/(assign)/.test(pathname)) {
          const apiName = state.parentName;
          dispatch({
            type: 'assignState',
            payload: {
              apiName,
            },
          });
          dispatch({
            type: 'fetch',
          });
        }else{
          dispatch({
            type: 'assignState',
            payload: initialState,
          });
        }
      });
    },
  },
});
