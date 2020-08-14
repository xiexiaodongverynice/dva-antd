import { hashHistory } from 'dva/router';
import mixinModels from '../../libs/mixinModels';
import * as kpiDefService from '../../services/kpiDef';
import * as baseModel from '../base';
import { message } from 'antd';
import * as updateReducers from './updateReducers';
import * as commonState from './state';
import _ from 'lodash';

const initialState = Object.assign({}, commonState.state, {id: null});

export default mixinModels(baseModel, updateReducers, {
  namespace: 'kpi_def_update',
  state: initialState,
  reducers: {},
  effects: {
    *fetch({ payload }, { call, put, select }) {
      const { id } = yield select(state => state.kpi_def_update);
      const response = yield call(kpiDefService.loadById, id);
      if(response){
        yield put({
          type: 'assignState',
          payload: {
            kpiDef: _.get(response, 'data.data.body'),
            loading: false,
          },
        });
      }
    },
    *save({payload}, {put, call, select}){
      const { kpiDef } = yield select(state => state.kpi_def_update);
      const response = yield call(kpiDefService.update, kpiDef);
      if(response){
        message.info(_.get(response, 'data.data.head.msg'));
        hashHistory.push('/kpi_def/list');
      }
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (/\/kpi_def\/(edit|view)/.test(pathname)) {
          const { id } = query;
          dispatch({
            type: 'assignState',
            payload: {
              id,
            },
          });
          dispatch({
            type: 'fetch',
          });
        }else{
          dispatch({
            type: 'assignState',
            payload: initialState,
          });
        }
      });
    },
  },
});
