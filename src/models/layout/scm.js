import { message } from 'antd';
import { hashHistory } from 'dva/router';
import _ from 'lodash';
import * as scmService from '../../services/scm';
import * as layoutService from '../../services/layout';
import mixinModels from '../../libs/mixinModels';
import * as baseModel from '../base';
import { fetchRecentlyCommit } from '../../services/scm';
import { omitProps } from './helper';

const initialState = {
  recentlyCommit: null,
  diffResult: null,
  id: null,
  type: 'layout',
  description: '',
}

export default mixinModels(baseModel, {
  namespace: 'layoutScm',
  state: Object.assign({}, initialState),
  effects: {
    *fetchRecentlyCommit({payload}, {put, call, select}){
      const state = yield select(state => state.layoutScm);
      const { id, type } = state;
      const { data } = yield call(scmService.fetchRecentlyCommit, {
        id,
        type,
      });
      if(data){
        yield put({
          type: 'assignState',
          payload: {
            recentlyCommit: _.get(data, 'data.body.result'),
          },
        });
      }
    },

    *fetchRecentlyCommitDiff({payload}, {put, call, select}){
      const state = yield select(state => state.layoutScm);
      const { id, type } = state;
      const { data } = yield call(scmService.fetchRecentlyCommitDiff, {
        id,
        type,
      });
      if(data){
        yield put({
          type: 'assignState',
          payload: {
            diffResult: _.get(data, 'data.body.result'),
          },
        });
      }
    },

    *new({payload}, {call, put, select}){
      const state = yield select(state => state.layoutScm);
      const { id, type, description } = state;
      if(description.length === 0 || description === '' || description === null || _.isUndefined(description)){
        message.error('请填写描述(数字、字符、下划线、中文，50字以内)');
        return;
      }
      const { parentName } = payload;
      const { data } = yield call(scmService.newScm, {
        id,
        type,
        description,
      });
      if(data){
        message.success("创建新版本成功!");
        hashHistory.push({
          pathname: '/layouts/history',
          query: {
            id,
          },
          state: {
            parentName,
          }
        });
      }
    }
  },
  // 路由监听器
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query } = location) => {
        if (pathname === '/layouts/scm') {
          dispatch({
            type: 'assignState',
            payload: {
              id: query.id,
            },
          });
          // dispatch({
          //   type: 'fetchRecentlyCommit',
          // });
          dispatch({
            type: 'fetchRecentlyCommitDiff',
          })
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
