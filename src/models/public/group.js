import { message } from 'antd';
import * as profileService from '../../services/group_add';
import { fieldValue, object_serialize, object_expandedKeys, permisson_serialize } from '../../utils';


export default {
  namespace: 'group_add',
  state: {
    objectList: [],
    objectFieldList: [],
    data_obj: [],
    expandedKeys: [],
    autoExpandParent: true,
    checkedKeys: [],
  },
  reducers: {
    save(state, { payload: { objectList, data_obj, checkedKeys, expandedKeys } }) {
      return { ...state, objectList, data_obj, checkedKeys, expandedKeys };
    },
    save_field_obj(state, { payload: { objectFieldList } }) {
      return { ...state, objectFieldList };
    },
    save_expandedKeys(state, { payload: { expandedKeys, autoExpandParent } }) {
      return { ...state, expandedKeys, autoExpandParent };
    },
    save_checkedKeys(state, { payload: { checkedKeys } }) {
      return { ...state, checkedKeys };
    },
    save_data_obj(state, { payload: { data_obj } }) {
      return { ...state, data_obj };
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      let checkedKeys = [];
      let objList = {};
      yield put({
        type: 'save',
        payload: {
          objectList: [],
          data_obj: {},
          checkedKeys: [],
          expandedKeys: [],
        },
      });
      const objectData = yield call(profileService.getObjectList, payload);
      const { data } = yield call(profileService.getGroupById, payload);
      if (objectData || data) {
        if (!objectData.data.data.body.items) {
          objectData.data.data.body.items = [];
        }
        if (!data.data.body) {
          data.data.body = [];
        }
        checkedKeys = object_serialize(data.data.body.permission);
        objList = object_expandedKeys(checkedKeys);
        yield put({
          type: 'save',
          payload: {
            objectList: objectData.data.data.body.items,
            data_obj: data.data.body,
            checkedKeys,
            expandedKeys: objList.list,
          },
        });
      }
    },
    *field({ payload: { data_obj, objectId } }, { call, put }) {
      yield put({
        type: 'fetch',
        payload: {
          id: data_obj.id,
        },
      });
      const objectFieldData = yield call(profileService.getObjectFieldList, objectId);

      if (objectFieldData || data_obj) {
        if (!objectFieldData.data.data.body.items) {
          objectFieldData.data.data.body.items = [];
        }

        yield put({
          type: 'save_field_obj',
          payload: { objectFieldList: objectFieldData.data.data.body.items },
        });
      }
    },
    *obj_add({ payload: { checkedKeys, data_obj } }, { call, put }) {
      const abc = permisson_serialize(checkedKeys, data_obj);

      const { data } = yield call(profileService.editGroup, abc);
      if (data) {
        message.success('修改成功！');

        yield put({
          type: 'fetch',
          payload: {
            id: data.data.body.id,
          },
        });
      } else {
        message.error('修改失败');
      }
    },
    *field_add({ payload: { data_obj } }, { call, put }) {
      if (Array.isArray(data_obj.permission)) {
        data_obj.permission = JSON.stringify(data_obj.permission);
      }
      const { data } = yield call(profileService.editGroup, data_obj);
      if (data) {
        message.success('修改成功！');
        yield put({
          type: 'fetch',
          payload: {
            id: data.data.body.id,
          },
        });
      } else {
        message.error('修改失败');
      }
    },
    *onExpand({ payload }, { put }) {
      yield put({
        type: 'save_expandedKeys',
        payload: {
          expandedKeys: payload.expandedKeys,
          autoExpandParent: payload.autoExpandParent,
        },
      });
    },
    *onCheck({ payload }, { put }) {
      yield put({
        type: 'save_checkedKeys',
        payload: {
          checkedKeys: payload.checkedKeys,
        },
      });
    },
    *onChecks({ payload: { record, field_value, data_obj, objectList } }) {  /* eslint require-yield: [0] */
      fieldValue(record, field_value, data_obj, objectList);
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/group/group_add') {
          dispatch({ type: 'fetch', payload: query });
        }
        if (pathname === '/group/group_see') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};
