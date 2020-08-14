import { message } from 'antd';
import _ from 'lodash';
import { redirectToList, saveData } from '../utils/custom_util';
import * as baseModel from './base';
import * as paginationModel from './pagination';
import mixinModels from '../libs/mixinModels';
import * as rolesService from '../services/role';

// 11/01/2018 - TAG: 获取数据列表
function* fetchList({ payload = {} }, { call, put, select }) {
  const state = yield select(state => state.roles);
  const { data } = yield call(rolesService.fetch, Object.assign({}, _.pick(state, ['pageNo', 'pageSize', 'order', 'orderBy', 'name']), payload));
  yield saveData(data, { put });
}

const craftEmptyObject = () => {
  return {
    id: '',
    name: '',
    display_name: '',
    external_id: '',
    data_authority: null,
  };
};

// 11/01/2018 - TAG: 重置角色
function* emptyRole({ put }) {
  yield put({
    type: 'assignState',
    payload: {
      role: craftEmptyObject(),
    },
  });
}

const initialState = {
  body: [],

  pageNo: 1,
  pageSize: 10,
  resultCount: 0,

  order: 'asc',
  orderBy: 'name',

  name: null,

  role: craftEmptyObject(),
}

export default mixinModels(baseModel, paginationModel, {
  namespace: 'roles',
  state: Object.assign({}, initialState),
  reducers: {
  },
  effects: {
    *fetch({ payload }, saga) {
      yield fetchList({ payload }, saga);
    },
    // 11/01/2018 - TAG: 保存
    *create({ payload: values }, { call, put }) {
      const { data } = yield call(rolesService.create, values);
      yield redirectToList(data, '/role', { put }, { msg: '创建成功!' });
    },
    // 11/01/2018 - TAG: 保存并新建，留在当前页
    *creates({ payload: values }, { call, put }) {
      const { data } = yield call(rolesService.create, _.omit(values, ['form']));
      if (data) {
        message.success('保存成功!');
        yield emptyRole({ put });
        const { form = { resetFields: () => {} } } = values;
        form.resetFields();
      }
    },
    // 11/01/2018 - TAG: 编辑
    *editRole({ payload: values }, { call, put }) {
      const { data } = yield call(rolesService.Edit, values);
      yield redirectToList(data, '/role', { put }, { msg: '修改成功!' });
    },
    // 11/01/2018 - TAG: 根据id获取一个角色的信息
    *oneRoles({ payload: { id } }, { call, put }) {
      yield emptyRole({ put });
      if (id) {
        const { data } = yield call(rolesService.oneRole, { id });
        if (data) {
          yield put({
            type: 'assignState',
            payload: {
              role: _.get(data, 'data.body'),
            },
          });
        }
      }
    },
    // 11/01/2018 - TAG: 删除角色
    *delRole({ payload: { id } }, { call, put }) {
      const { data } = yield call(rolesService.delRole, { id });
      yield redirectToList(data, '/role', { put }, { msg: '删除成功!' });
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (/^\/role\/?$/.test(pathname)) {
          dispatch({
            type: 'fetch',
            payload: query,
          });
        } else if (/^\/role\/(add|edit|detail)\/?$/.test(pathname)) {
          dispatch({
            type: 'oneRoles',
            payload: query,
          });
        }else{
          dispatch({
            type: 'assignState',
            payload: Object.assign({}, initialState)
          })
        }
      });
    },
  },
});
