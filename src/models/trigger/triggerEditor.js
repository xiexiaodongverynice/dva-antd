import modelExtend from 'dva-model-extend';
import pathToRegexp from 'path-to-regexp';
import { message } from 'antd';
import * as baseModel from '../base';
import * as triggerService from '../../services/trigger';
import { template as script } from '../../helpers/triggerHelper';

export default modelExtend(baseModel, {
  namespace: 'triggerEditor',
  state: {
    trigger: {
      name: '',
      api_name: '',
      api_version: '',
      describe: '',
      is_active: '',
      script: '',
    },

    mode: '',         // 当前编辑模式-修改:edit&新建:add
  },
  reducers: {
    updateTrigger(state, { payload }) {
      return {
        ...state,
        trigger: Object.assign({}, state.trigger, payload),
      };
    },
  },
  effects: {
    // 创建触发器
    *create({ payload }, { call, select, put }) {
      const values = yield select(state => state.triggerEditor.trigger);
      const response = yield call(triggerService.create, values);
      message.success('保存成功!');
      // 重置为编辑状态
      yield put({
        type: 'assignState',
        payload: {
          mode: 'edit',
          trigger: response.data.data.body,
        },
      });
    },
    // 更新触发器
    *creates({ payload }, { call, select, put }) {
      const values = yield select(state => state.triggerEditor.trigger);
      const response = yield call(triggerService.update, values);
      message.success('修改成功!');
      yield put({
        type: 'assignState',
        payload: {
          mode: 'edit',
          trigger: response.data.data.body,
        },
      });
    },
    // 根据objectDescribeId和triggerId查询触发器
    *query({ payload }, { call, put }) {
      const { data } = yield call(triggerService.query, payload.id);
      const trigger = data.data.body;
      if (data) {
        yield put({
          type: 'assignState',
          payload: {
            trigger,
            mode: 'edit',
          },
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        const match = pathToRegexp('/trigger/:objectDescribeId/editor').exec(pathname);
        if (match) {
          // 如果给定了trigger_id,表示修改，否则表示新建
          if (query.id) {
            dispatch({ type: 'query',
              payload: {
                objectDescribeId: match[1],
                id: query.id,
              } });
          } else {
            dispatch({ type: 'assignState',
              payload: {
                mode: 'add',
                trigger: {
                  api_name: query.api_name,
                  is_active: false,
                  name: '',
                  api_version: '',
                  describe: '',
                  script,
                },
              } });
          }
        }
      });
    },
  },
});
