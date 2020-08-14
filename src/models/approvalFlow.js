import { hashHistory } from 'dva/router';
import { message } from 'antd';
import _ from 'lodash';
import * as approvalFlowService from '../services/approvalFlow';
import * as approvalFlowAssignService from '../services/approvalFlowAssign';
import * as objectDescribeService from '../services/customObjects';


function* fetchList({ payload = {} }, { call, put }) {
  const { data } = yield call(approvalFlowService.fetch);
  if (data) {
    const body = _.chain(data).result('data').result('body', {}).value();
    const { items = [] } = body;
    yield put({
      type: 'save',
      payload: Object.assign({}, {
        body: items,
      }, payload),
    });
  }
}

function* fetchObjectDescribeList({ payload = {} }, { call, put }) {
  const { data } = yield call(objectDescribeService.fetchAll);
  if (data) {
    yield put({
      type: 'saveObjectDescribes',
      payload: Object.assign({}, {
        object_describes: data,
      }, payload),
    });
  }
}


const initialState = {
  body: [],
  object_describes: [],
  approval_flow: {
    name: '',
    api_name: '',
    api_version: '',
    description: '',
    script: '',
    script_type: 0,
  },
  showInitModal: false,
  currentItem: {},
  modalDistributionVisible: false,
  confirmLoading: false,
};


export default {
  namespace: 'approval_flow',
  state: Object.assign({}, initialState),
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    saveObjectDescribes(state, { payload: { object_describes } }) {
      return { ...state, object_describes };
    },
    saveApprovalFlow(state, { payload: { approval_flow } }) {
      return { ...state, approval_flow };
    },
    saveCurrentValue(state, { payload: { current_value } }) {
      const { approval_flow } = state;
      return { ...state, sequence: { ...approval_flow, current_value } };
    },
    changeDistributionModal(state, { payload }) {
      const { modalDistributionVisible = false, currentItem } = payload;
      return { ...state, currentItem, modalDistributionVisible };
    },
    changeConfirmLoading(state, { payload }) {
      const { confirmLoading = false } = payload;
      return { ...state, confirmLoading };
    },
  },
  effects: {
    // 获取数据列表
    *fetch({ payload }, { call, put }) {
      yield fetchList({ payload }, { call, put });
    },
    *create({ payload: values }, { call }) {
      const { data } = yield call(approvalFlowService.create, values);
      if (data) {
        message.success('保存成功');
        hashHistory.push('/approval_flow/index');
      }
    },
    *remove({ payload: { id } }, { call, put }) {
      const { data } = yield call(approvalFlowService.remove, { id });
      if (data) {
        yield fetchList({}, { call, put });
        message.success('删除成功');
      }
    },
    *update({ payload: { approval_flow }, callback }, { call, put }) {
      const { data } = yield call(approvalFlowService.update, approval_flow);
      if (data.data.head.code === 200) {
        message.success('保存成功');
        yield put({
          type: 'saveApprovalFlow',
          payload: {
            approval_flow: data.data.body,
          },
        });
        if (callback)callback();
      } else {
        message.error('保存失败');
      }
    },
    *assign({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeConfirmLoading',
        payload: {
          confirmLoading: true,
        },
      });
      const { data } = yield call(approvalFlowAssignService.assign, payload);
      if (_.get(data, 'data.head.code') === 200) {
        message.success('分配成功');
        if (callback)callback();
      } else {
        message.error('分配失败');
      }
      yield put({
        type: 'changeConfirmLoading',
        payload: {
          confirmLoading: false,
        },
      });
    },
    *fetchById({ payload: { id } }, { call, put }) {
      yield fetchObjectDescribeList({}, { call, put });
      const { data } = yield call(approvalFlowService.fetchById, id);
      if (data) {
        yield put({
          type: 'saveApprovalFlow',
          payload: {
            approval_flow: data.data.body,
          },
        });
      }
    },
    *fetchObjectDescribes({ payload }, { call, put }) {
      yield fetchObjectDescribeList({}, { call, put });
    },
    *initCreatePage({ payload }, { call, put }) {
      yield fetchObjectDescribeList({}, { call, put });
      yield put({
        type: 'saveApprovalFlow',
        payload: {
          approval_flow: {},
        },
      });
    },
    *initApprovalFlow({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          showInitModal: false,
        },
      });
      const { data } = yield call(approvalFlowService.init, {});
      if (data.data.head.code === 200) {
        message.success('审批流初始化成功!');
      } else {
        message.error(data.head.msg);
      }
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/approval_flow/index') {
          dispatch({ type: 'fetch', payload: query });
        }
        if (pathname === '/approval_flow/edit') {
          dispatch({ type: 'fetchById', payload: query });
        }
        if (pathname === '/approval_flow/add') {
          dispatch({
            type: 'initCreatePage',
            payload: {},
          });
        }
      });
    },
  },
};
