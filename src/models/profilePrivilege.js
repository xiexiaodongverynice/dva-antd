import { message } from 'antd';
import _ from 'lodash';
import * as profileService from '../services/simpleProfile';

const convertOldPermission = (permission) => {
  const converted = {};
  permission.forEach((objPrivilege) => {
    const { obj_name, obj_value, obj_field } = objPrivilege;
    if (obj_name && obj_value) {
      converted[`obj.${obj_name}`] = obj_value;
      if (obj_field && Array.isArray(obj_field)) {
        obj_field.forEach((fieldPrivilege) => {
          const { field_name, field_value } = fieldPrivilege;
          converted[`field.${obj_name}.${field_name}`] = field_value;
        });
      }
    }
  });
  return converted;
};

const parsePermissionJson = (permissionStr) => {
  try {
    return JSON.parse(permissionStr);
  } catch (e) {
    console.warn('invalid json: ', permissionStr);
    return {};
  }
};

export default {
  namespace: 'profile_privilege',
  state: {
    id: '',
    permission: {},
    version: 0,
    name: '',
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(profileService.getSimpleProfileById, payload);
      const profile = response.data.data.body;
      const { id, permission: permissionStr, version, selected_options, app_authorize } = profile;
      const permission = parsePermissionJson(permissionStr);
      yield put({
        type: 'save',
        payload: {
          id,
          // 这里是为了兼容老的permission串的格式
          permission: Array.isArray(permission) ? convertOldPermission(permission) : permission,
          version,
          selected_options,
          app_authorize,
        },
      });
    },
    // *query({ payload }, { call }) {
    //   const response = yield call(profileService.getQuery, payload);
    //   if (_.get(response, 'data.data.head.code') === 200) {
    //     message.success('操作成功!');
    //   } else {
    //     message.error('操作失败！');
    //   }
    // },
    *updatePermission({ payload }, { call, put }) {
      const { id, version, permission: permissionObj, selected_options, app_authorize } = payload;
      const response = yield call(profileService.editSimpleProfile, {
        id,
        version,
        permission: JSON.stringify(permissionObj),
        selected_options,
        app_authorize,
      });
      const { permission: permissionStr, version: newVersion } = response.data.data.body;
      const permission = parsePermissionJson(permissionStr);
      yield put({
        type: 'save',
        payload: {
          // 这里是为了兼容老的permission串的格式
          permission: Array.isArray(permission) ? convertOldPermission(permission) : permission,
          version: newVersion,
        },
      });
      message.success('权限更新成功');
    },
  },

  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/profile/privileges') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};
