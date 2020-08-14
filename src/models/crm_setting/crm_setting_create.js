/*
 * @Author: mll
 * @Date: 2018-09-05 17:19
 * @Last Modified by: mll
 * @Last Modified time: 2018-09-05 17:19
 * @Description:
 */

import { hashHistory } from 'dva/router';
import _ from 'lodash';
import * as tenantSettingService from '../../services/tenantSetting';

export default {
  namespace: 'crm_setting_create',
  state: {
    body: {},
  },
  reducers: {
  },
  effects: {
    *create({ payload }, { call }) {
      const res = yield call(tenantSettingService.create, payload);
      const code = _.chain(res).result('data').result('data').result('code').value();
      if (code === 200) return hashHistory.push('/crm_setting/index');
    },
  },
};
