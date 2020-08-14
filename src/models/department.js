import { message } from 'antd';
import _ from 'lodash';
import { redirectToList, saveData } from '../utils/custom_util';
import * as baseModel from './base';
import * as paginationModel from './pagination';
import mixinModels from '../libs/mixinModels';
import * as departmentsService from '../services/department';

// 12/01/2018 - TAG: 获取数据列表
function* fetchList({ payload = {} }, { call, put, select }) {
  const state = yield select(state => state.departments);
  const { data } = yield call(departmentsService.fetch, Object.assign({}, _.pick(state, ['pageNo', 'pageSize', 'order', 'orderBy', 'name']), payload));
  yield saveData(data, { put });
}

const craftEmptyObjectt = () => {
  return {
    id: '',
    name: '',
    api_name: '',
    external_id: '',
  };
};

const initialState = {
  body: [],
  pageNo: 1,
  pageSize: 10,
  resultCount: 0,
  order: 'desc',
  orderBy: 'name',
  name: null,
  department: craftEmptyObjectt(),
}

export default mixinModels(baseModel, paginationModel, {
  namespace: 'departments',
  state: Object.assign({}, initialState),
  reducers: {
    deepAssignDepartment(state, { payload }) {
      return {
        ...state,
        department: Object.assign({}, state.department, payload),
      };
    },
  },
  effects: {
    *fetch({ payload }, saga) {
      yield fetchList({ payload }, saga);
    },
    *create({ payload: values }, { call, put }) {
      const { data } = yield call(departmentsService.create, values);
      yield redirectToList(data, '/department', { put }, { msg: '创建成功!' });
    },
    *creates({ payload: values }, { call, put }) {
      const { data } = yield call(departmentsService.create, _.omit(values, ['form']));
      if (data) {
        message.success('保存成功!');
        yield put({
          type: 'assignState',
          payload: {
            department: craftEmptyObjectt(),
          },
        });
        const { form = { resetFields: () => {} } } = values;
        form.resetFields();
      }
    },
    *editdepartment({ payload: values }, { call, put }) {
      const { data } = yield call(departmentsService.Edit, values);
      yield redirectToList(data, '/department', { put }, { msg: '修改成功!' });
    },
    *onedepartments({ payload: { id } }, { call, put }) {
      yield put({
        type: 'assignState',
        payload: {
          department: craftEmptyObjectt(),
        },
      });
      if (id) {
        const { data } = yield call(departmentsService.onedepartment, { id });
        if (data) {
          yield put({
            type: 'assignState',
            payload: {
              department: _.get(data, 'data.body'),
            },
          });
        }
      }
    },
    *deldepartment({ payload: { id } }, { call, put }) {
      const { data } = yield call(departmentsService.deldepartment, { id });
      yield redirectToList(data, '/department', { put }, { msg: '删除成功!' });
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (/^\/department\/?$/.test(pathname)) {
          dispatch({
            type: 'fetch',
            payload: query,
          });
        } else if (/^\/department\/(add|edit)\/?$/.test(pathname)) {
          dispatch({
            type: 'onedepartments',
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
