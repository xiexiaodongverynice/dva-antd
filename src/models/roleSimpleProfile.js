import { message } from 'antd';
import * as profileService from '../services/simpleProfile';

function checkPermisson(param) {
  let permissonStr = [];
  if (param != '' && param != undefined) {
    permissonStr = eval(`(${param})`);
  }
  return permissonStr;
}

function objectValue(str) {
  const nodes = [];
  if (str != undefined && str != '') {
    const json = eval(`(${str})`);
    if (json != undefined) {
      for (let i = 0; i < json.length; i++) {
        const key = json[i];
        const numValue = parseInt(key.obj_value, 10);
        switch (numValue) {
          case 2:
            nodes.push(`${key.obj_id}-1-${key.obj_name}`);
            break;
          case 4:
            nodes.push(`${key.obj_id}-2-${key.obj_name}`);
            break;
          case 8:
            nodes.push(`${key.obj_id}-3-${key.obj_name}`);
            break;
          case 16:
            nodes.push(`${key.obj_id}-4-${key.obj_name}`);
            break;
          case 32:
            nodes.push(`${key.obj_id}-5-${key.obj_name}`);
            break;
          case 64:
            nodes.push(`${key.obj_id}-6-${key.obj_name}`);
            break;
          case 128:
            nodes.push(`${key.obj_id}-7-${key.obj_name}`);
            break;
          default :
            if ((numValue & 2) == 2) {
              nodes.push(`${key.obj_id}-1-${key.obj_name}`);
            }
            if ((numValue & 4) == 4) {
              nodes.push(`${key.obj_id}-2-${key.obj_name}`);
            }
            if ((numValue & 8) == 8) {
              nodes.push(`${key.obj_id}-3-${key.obj_name}`);
            }
            if ((numValue & 16) == 16) {
              nodes.push(`${key.obj_id}-4-${key.obj_name}`);
            }
            if ((numValue & 32) == 32) {
              nodes.push(`${key.obj_id}-5-${key.obj_name}`);
            }
            if ((numValue & 64) == 64) {
              nodes.push(`${key.obj_id}-6-${key.obj_name}`);
            }
            if ((numValue & 128) == 128) {
              nodes.push(`${key.obj_id}-7-${key.obj_name}`);
            }
        }
      }
    }
  }
  return nodes;
}

export default {
  namespace: 'roleProfile',
  state: {
    objectList: [],
    objectFieldList: [],
    profileData: [],
    permissonStr: [],
    permissonSelect: [],
    fields: [],
    nodes: [],
  },
  reducers: {
    save(state, { payload: { objectList, profileData, objectFieldList, permissonStr, permissonSelect, fields, nodes, viewType } }) {
      return { ...state, objectList, profileData, objectFieldList, permissonStr, permissonSelect, fields, nodes, viewType };
    },
    saveObject(state, { payload: { nodes, permissonStr } }) {
      return { ...state, nodes, permissonStr };
    },
    saveField(state, { payload: { fields, permissonSelect } }) {
      return { ...state, fields, permissonSelect };
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      let objectList = [];
      const objectFieldList = [];
      let profileData = {};
      let permissonStr = [];
      let nodes = [];
      // 取得所有描述对象
      const objectData = yield call(profileService.getObjectList, payload);
      if (objectData != undefined
          && objectData.data != undefined
          && objectData.data.data != undefined
          && objectData.data.data.body != undefined
          && objectData.data.data.body.items != undefined) {
        objectList = objectData.data.data.body.items;
      }
      // 取得当前简档权限
      if (payload.type == 'profile') {
        const { data } = yield call(profileService.getSimpleProfileById, payload);
        if (data != undefined
            && data.data != undefined
            && data.data.body != undefined) {
          profileData = data.data.body;
          permissonStr = checkPermisson(data.data.body.permission);
          nodes = objectValue(data.data.body.permission);
        }
      }
      yield put({
        type: 'save',
        payload: { objectList, profileData, objectFieldList, permissonStr, nodes, viewType: payload.viewType },
      });
    },
    *add({ payload }, { call, put }) {
      const { data } = yield call(profileService.editSimpleProfile, payload);
      if (data != undefined
          && data.data != undefined
          && data.data.head != undefined
          && data.data.head.code == 200) {
        message.success('注册成功！');
      } else {
        message.error('修改失败');
      }
      let objectList = [];
      let profileData = {};
      let permissonStr = [];
      let nodes = [];
      // 取得所有描述對象
      const objectData = yield call(profileService.getObjectList, payload);
      if (objectData != undefined
        && objectData.data != undefined
        && objectData.data.data != undefined
        && objectData.data.data.body != undefined
        && objectData.data.data.body.items != undefined) {
        objectList = objectData.data.data.body.items;
      }
      // 取得当前简档权限
      const proData = yield call(profileService.getSimpleProfileById, payload);
      if (proData.data != undefined
        && proData.data.data != undefined
        && proData.data.data.body != undefined) {
        profileData = proData.data.data.body;
        permissonStr = checkPermisson(proData.data.data.body.permission);
        nodes = objectValue(proData.data.data.body.permission);
      }
      yield put({
        type: 'save',
        payload: { objectList, profileData, permissonStr, nodes, viewType: payload.viewType },
      });
    },
    *field({ payload }, { call, put }) {
      let objectList = [];
      let objectFieldList = [];
      let profileData = {};
      let permissonStr = [];
      let permissonSelect = [];
      const fields = [];
      let nodes = [];
      // 取得所有描述对象
      const objectData = yield call(profileService.getObjectList, payload);
      if (objectData != undefined
        && objectData.data != undefined
        && objectData.data.data != undefined
        && objectData.data.data.body != undefined
        && objectData.data.data.body.items != undefined) {
        objectList = objectData.data.data.body.items;
      }
      // 取得所有描述對象
      const objectFieldData = yield call(profileService.getObjectFieldList, payload);
      if (objectFieldData != undefined
        && objectFieldData.data != undefined
        && objectFieldData.data.data != undefined
        && objectFieldData.data.data.body != undefined
        && objectFieldData.data.data.body.items != undefined) {
        objectFieldList = objectFieldData.data.data.body.items;
      }
      // 取得当前简档权限
      if (payload.type == 'profile') {
        const { data } = yield call(profileService.getSimpleProfileById, payload);
        if (data != undefined
          && data.data != undefined
          && data.data.body != undefined) {
          profileData = data.data.body;
          nodes = objectValue(data.data.body.permission);
          permissonStr = checkPermisson(data.data.body.permission);
          permissonSelect = checkPermisson(data.data.body.permission);
        }
      }
      yield put({
        type: 'save',
        payload: { objectList, profileData, objectFieldList, permissonStr, permissonSelect, fields, nodes, viewType: payload.viewType },
      });
    },
    *objectFlesh({ payload }, { put }) {
      const nodes = payload.nodes;
      const permissonStr = payload.permissonStr;
      yield put({
        type: 'saveObject',
        payload: { nodes, permissonStr },
      });
    },
    *fieldFlesh({ payload }, { put }) {
      const fields = payload.fields;
      const permissonSelect = payload.permissonSelect;
      yield put({
        type: 'saveField',
        payload: { fields, permissonSelect },
      });
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/profile/roleProfile') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};
