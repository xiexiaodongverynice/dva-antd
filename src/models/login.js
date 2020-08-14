import { routerRedux } from 'dva/router';
import { message } from 'antd';
import * as loginService from '../services/login';
import * as permissionService from '../services/userPermission';

export default {
  namespace: 'logins',
  state: {},
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(loginService.login, payload);
      if (response.data.head.code === 200) {
        localStorage.setItem('token', response.data.head.token);
        localStorage.setItem('adminUserInfo', JSON.stringify(response.data.body.user_info));
        const permission = response.data.body.permission;
        const profile = response.data.body.profile;
        if (!profile) {
          message.error('对不起，未能获得该用户的简档信息');
          return;
        }
        if (!profile.is_super_profile) {
          message.error('对不起，当前用户不是超级管理员，不能进入租户管理系统');
          return;
        }
        if (permission) {
          permissionService.setPermission(permission);
        }
        message.success('欢迎登录！');
        yield put(routerRedux.push('/home'));
      } else {
        message.error(response.data.head.msg);
      }
    },
  },
};
