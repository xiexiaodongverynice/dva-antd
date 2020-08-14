import { message } from 'antd';
import * as groupService from '../services/group';

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

export default {
  namespace: 'group_privilege',
  state: {
    id: '',
    permission: {},
    version: 0,
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(groupService.onegroup, payload);
      const permissionSet = response.data.data.body;
      const { id, permission: permissionStr, version, app_authorize } = permissionSet;
      const permission = permissionStr ? JSON.parse(permissionStr) : {};
      yield put({
        type: 'save',
        payload: {
          id,
          // 这里是为了兼容老的permission串的格式
          permission: Array.isArray(permission) ? convertOldPermission(permission) : permission,
          version,
          app_authorize,
        },
      });
    },
    *updatePermission({ payload }, { call, put }) {
      const { id, version, permission: permissionObj, app_authorize } = payload;
      const response = yield call(groupService.Editgroup, {
        id,
        version,
        permission: JSON.stringify(permissionObj),
        app_authorize,
      });
      const { permission: permissionStr, version: newVersion } = response.data.data.body;
      const permission = JSON.parse(permissionStr);
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
        if (pathname === '/group/privileges') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};
