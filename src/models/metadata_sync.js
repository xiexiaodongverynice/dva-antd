import { message } from 'antd';
import _ from 'lodash';
import * as metadataSyncService from '../services/metdataSync';
/**
 * Created by xinli on 2017/11/14.
 */

export default {
  namespace: 'metadata_sync',
  state: {
    body: [],
    syncResult: [],
    objectList: [],
  },
  reducers: {
    save(state, { payload: { syncResult } }) {
      return { ...state, syncResult };
    },
  },
  effects: {
    *hidesync({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: { syncResult: [] },
      });
    },
    *sync({ payload }, { call, put }) {
      const response = yield call(metadataSyncService.sync, payload);
      console.log(response);
      if (_.get(response, 'data.data.head.code') === 200) {
        const syncResult = response.data.data.body.syncResult;
        message.success('同步成功!');
        yield put({
          type: 'save',
          payload: { syncResult },
        });
      } else {
        // message.error('同步失败！');
        yield put({
          type: 'save',
          payload: { syncResult: [] },
        });
      }
    },
    *object_describe({ payload, callback }, { call }) {
      const response = yield call(metadataSyncService.objectAllList, payload);
      if (_.get(response, 'data.data.head.code') === 200) {
        const objectList = response.data.data.body.result;
        callback(objectList);
        // message.success('同步成功!');
      } else {
        message.error('暂无子数据！');
      }
    },
    *layout({ payload, callback }, { call }) {
      const response = yield call(metadataSyncService.object_layout, payload);
      if (_.get(response, 'data.data.head.code') === 200) {
        const objectList = response.data.data.body.items;
        callback(objectList);
        // message.success('同步成功!');
      } else {
        message.error('暂无子数据！');
      }
    },
    *profile({ payload, callback }, { call }) {
      const response = yield call(metadataSyncService.object_profile, payload);

      if (_.get(response, 'data.data.head.code') === 200) {
        const objectList = response.data.data.body.result;
        callback(objectList);
        // message.success('同步成功!');
      } else {
        message.error('暂无子数据！');
      }
    },
    *kpi({ payload, callback }, { call }) {
      const response = yield call(metadataSyncService.object_kpiDef, payload);
      if (_.get(response, 'data.data.head.code') === 200) {
        const objectList = response.data.data.body.result;
        callback(objectList);
      } else {
        message.error('暂无子数据！');
      }
    },
    *sequence({ payload, callback }, { call }) {
      const response = yield call(metadataSyncService.object_sequence, payload);
      if (_.get(response, 'data.data.head.code') === 200) {
        const objectList = response.data.data.body.items;
        callback(objectList);
        // message.success('同步成功!');
      } else {
        message.error('暂无子数据！');
      }
    },
    *translation({ payload, callback }, { call }) {
      const response = yield call(metadataSyncService.object_translation, payload);
      if (_.get(response, 'data.data.head.code') === 200) {
        const objectList = response.data.data.body.items;
        callback(objectList);
        // message.success('同步成功!');
      } else {
        message.error('暂无子数据！');
      }
    },
    *action_script({ payload, callback }, { call }) {
      const response = yield call(metadataSyncService.object_action_script, payload);
      if (_.get(response, 'data.data.head.code') === 200) {
        const objectList = response.data.data.body.items;
        callback(objectList);
        // message.success('同步成功!');
      } else {
        message.error('暂无子数据！');
      }
    },
    *trigger({ payload, callback }, { call }) {
      const response = yield call(metadataSyncService.object_trigger_page, payload);
      if (_.get(response, 'data.data.head.code') === 200) {
        const objectList = response.data.data.body.result;
        const notEmptyList = _.filter(objectList, (obj) => {
          return !_.isEmpty(_.get(obj, 'triggers'));
        });
        callback(notEmptyList);
        // message.success('同步成功!');
      } else {
        message.error('暂无子数据！');
      }
    },
    *tab({ payload, callback }, { call }) {
      const response = yield call(metadataSyncService.object_tab, payload);
      if (_.get(response, 'data.data.head.code') === 200) {
        const objectList = response.data.data.body.items;
        callback(objectList);
        // message.success('同步成功!');
      } else {
        message.error('暂无子数据！');
      }
    },
    *tenant_setting({ payload, callback }, { call }) {
      const response = yield call(metadataSyncService.object_tenant_setting, payload);
      if (_.get(response, 'data.data.head.code') === 200) {
        const objectList = response.data.data.body.items;
        callback(objectList);
        // message.success('同步成功!');
      } else {
        message.error('暂无子数据！');
      }
    },
    *function_permission({ payload, callback }, { call }) {
      const response = yield call(metadataSyncService.object_function_permission, payload);
      if (_.get(response, 'data.data.head.code') === 200) {
        const objectList = response.data.data.body.items;
        callback(objectList);
        // message.success('同步成功!');
      } else {
        message.error('暂无子数据！');
      }
    },
    *approval_flow({ payload, callback }, { call }) {
      const response = yield call(metadataSyncService.object_approval_flow, payload);
      if (_.get(response, 'data.data.head.code') === 200) {
        const objectList = response.data.data.body.items;
        callback(objectList);
        // message.success('同步成功!');
      } else {
        message.error('暂无子数据！');
      }
    },
    *layout_assign({ payload, callback }, { call }) {
      const response = yield call(metadataSyncService.object_layout_assign, payload);
      if (_.get(response, 'data.data.head.code') === 200) {
        const objectList = response.data.data.body.items;
        callback(objectList);
        // message.success('同步成功!');
      } else {
        message.error('暂无子数据！');
      }
    },
  },
};
