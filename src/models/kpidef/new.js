import { hashHistory } from 'dva/router';
import mixinModels from '../../libs/mixinModels';
import * as kpiDefService from '../../services/kpiDef';
import * as baseModel from '../base';
import { message } from 'antd';
import * as updateReducers from './updateReducers';
import * as commonState from './state';

const initialState = commonState.state;

export default mixinModels(baseModel, updateReducers, {
  namespace: 'kpi_def_new',
  state: initialState,
  reducers: {},
  effects: {
    *save({payload}, {put, call, select}){
      const { kpiDef } = yield select(state => state.kpi_def_new);
      const response = yield call(kpiDefService.create, kpiDef);
      if(response){
        message.info(_.get(response, 'data.data.head.msg'));
        hashHistory.push('/kpi_def/list');
      }
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (!/\/kpi_def\/(new)/.test(pathname)) {
          dispatch({
            type: 'assignState',
            payload: initialState,
          });
        }
      });
    },
  },
});
