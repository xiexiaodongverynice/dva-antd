import { message } from 'antd';
import { routerRedux } from 'dva/router';
import _ from 'lodash';
import * as scmService from '../../services/scm';
import * as layoutService from '../../services/layout';
import mixinModels from '../../libs/mixinModels';
import * as baseModel from '../base';
import { fetchCommitDiff, rollback } from '../../services/scm';

const initialState = {
  list: [], // 版本历史记录
  id: null,
  type: 'layout',

  newCommit: '',
  oldCommit: '',

  diffResult: '',

  visible: false,

  commitName: '', // 回滚所使用的参数
};

export default mixinModels(baseModel, {
  namespace: 'layoutHistory',
  state: Object.assign({}, initialState),
  reducers: {},
  effects: {
    *list({payload}, {put, call, select}){
      const state = yield select(state => state.layoutHistory);
      const { id, type } = state;
      const { data } = yield call(scmService.fetchCommitList, {
        id,
        type,
      });
      if(data){
        yield put({
          type: 'assignState',
          payload: {
            list: _.get(data, 'data.body.result'),
          },
        });
      }
    },

    *showFileByCommit({payload}, { put, call, select }){
      const state = yield select(state => state.layoutHistory);
      const { id, type } = state;
      const { commitName } = payload;
      const { data } = yield call(scmService.showFileByCommit, {
        id,
        type,
        commitName,
      });
      if(data){
        yield put({
          type: 'assignState',
          payload: {
            list: state.list.map(item => {
              if(item.id === commitName){
                return Object.assign({}, item, {
                  content: _.get(data, 'data.body.result'),
                });
              }
              return item;
            }),
          },
        });
      }
    },

    *fetchCommitDiff({payload}, {put, call, select}){
      const state = yield select(state => state.layoutHistory);
      const { id, type, newCommit, oldCommit } = state;
      const { data } = yield call(scmService.fetchCommitDiff, {
        id,
        type,
        newCommit,
        oldCommit,
      });
      if(data){
        yield put({
          type: 'assignState',
          payload: {
            diffResult: _.get(data, 'data.body.result'),
            visible: true,
            modalStatus: 'view',
          },
        });
      }
    },

    // 30/01/2018 - TAG: 回滚前的对比
    *fetchCommitDiffEnsure({payload}, {put, call, select}){
      const state = yield select(state => state.layoutHistory);
      const { id, type } = state;
      const { oldCommit, commitName } = payload;
      const { data } = yield call(scmService.fetchCommitDiff, {
        id,
        type,
        newCommit: '',
        oldCommit,
      });
      if(data){
        yield put({
          type: 'assignState',
          payload: {
            diffResult: _.get(data, 'data.body.result'),
            visible: true,
            commitName,
            modalStatus: 'roolback',
          },
        });
      }
    },

    *rollback({payload}, {put, call, select}){
      const state = yield select(state => state.layoutHistory);
      const { id, type, commitName } = state;
      const { data } = yield call(scmService.rollback, {
        id,
        type,
        commitName
      });
      if(data){
        message.success("回滚成功!");
        yield put({
          type: 'assignState',
          payload: {
            visible: false,
            commitName: null,
          }
        })
      }
    }
  },
  // 路由监听器
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/layouts/history') {
          dispatch({
            type: 'assignState',
            payload: {
              id: query.id,
            },
          });
          dispatch({
            type: 'list',
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
