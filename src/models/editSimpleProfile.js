import { routerRedux } from 'dva/router';
import { message } from 'antd';
import _ from 'lodash';
import * as profileService from '../services/simpleProfile';

const initData = {
  id: '',
  name: '',
  api_name: '',
  external_id: '',
};

export default {
  namespace: 'editProfile',
  state: {
    data: {},
    proList: [],
  },
  reducers: {
    save(state, { payload: { data, proList } }) {
      return { ...state, data, proList };
    },
  },
  effects: {
    // 新建和复制操作
    *add({ payload }, { call, put }) {
      // 如果请求发生错误，则经过处理的返回值为{data: false}
      const { data } = yield call(profileService.addSimpleProfile, payload);
      if (!_.isEqual(data, false)) {
        const head = _.chain(data).result('data').result('head', {}).value();
        const { code } = head;
        if (code === 200) {
          message.success('新建简档成功！');
          yield put(routerRedux.push('/profile'));
        }
      }
    },
    // 根据id获取简档信息，当前操作为复制时，将获取到的信息报错到state中
    *copy({ payload }, { call, put }) {
      let data = {};
      const profileData = yield call(profileService.getSimpleProfileById, payload);
      const profileBody = _.chain(profileData).result('data').result('data').result('body').value();
      if (profileBody) {
        data = profileBody;
      }
      let proList = [];
      const proData = yield call(profileService.getSimpleProfileList, payload);
      const proBody = _.chain(proData).result('data').result('data').result('body').value();
      if (proBody) {
        proList = _.result(proBody, 'result');
      }
      const { type } = payload;
      if (type == 'add') {
        data.type = 'add';
      } else {
        data.type = 'copy';
      }
      yield put({
        type: 'save',
        payload: {
          data,
          proList,
        },
      });
    },
    // 新建操作
    *init({ payload }, { call, put }) {
      const proData = yield call(profileService.getSimpleProfileList, payload);
      const proList = _.chain(proData).result('data').result('data').result('body').result('result').value();
      const data = initData;
      data.type = 'add';
      yield put({
        type: 'save',
        payload: {
          data,
          proList,
        },
      });
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/profile/editProfile') {
          if (query.type == 'add') {
            dispatch({ type: 'init', payload: query });
          } else if (query.type == 'copy') {
            dispatch({ type: 'copy', payload: query });
          }
        }
      });
    },
  },
};
