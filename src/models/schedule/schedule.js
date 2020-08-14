import { hashHistory } from 'dva/router';
import { message } from 'antd';
import _ from 'lodash';
import * as scheduleService from '../../services/schedule';


function* fetchList({ payload = {} }, { call, put }) {
  const { data } = yield call(scheduleService.fetch);
  if (data) {
    const body = _.chain(data).result('data').result('body', {}).value();
    const { list = [] } = body;
    yield put({
      type: 'save',
      payload: Object.assign({}, {
        body: list,
      }, payload),
    });
  }
}

const initialState = {
  body: [],
  schedule: {
    job_name: '',
    api_name: '',
    cron: null,
    script: '',
    language: 0,
    param: {},
    remark: '',
    status: 0,
    tags: '',
    type: 0,
    persistence: false,
  },
};

export default {
  namespace: 'schedule',
  state: Object.assign({}, initialState),
  reducers: {
    init(state) {
      return {...initialState}
    },
    save(state, { payload: { body } }) {
      return { ...state, body };
    },
    saveSchedule(state, { payload: { schedule } }) {
      return { ...state, schedule };
    },
    assignSchedule(state, { payload }) {
      return { ...state, schedule: Object.assign({}, state.schedule, payload)}
    }
  },
  effects: {
    // 获取数据列表
    *fetch({ payload }, { call, put }) {
      yield fetchList({ payload }, { call, put });
    },
    *create({ payload: values }, { call }) {
      const { data } = yield call(scheduleService.create, values);
      if (data) {
        message.success('保存成功');
        hashHistory.push('/schedule');
      }
    },
    *remove({ payload: { id } }, { call, put }) {
      const { data } = yield call(scheduleService.remove, { id });
      if (data) {
        yield fetchList({}, { call, put });
        message.success('删除成功');
      }
    },
    *update({ payload: { schedule } }, { call, put }) {
      const { data } = yield call(scheduleService.update, schedule);
      if (data.data.head.code === 200) {
        message.success('保存成功');
        yield put({
          type: 'saveSchedule',
          payload: {
            schedule: data.data.body,
          },
        });
      } else {
        message.error('保存失败');
      }
    },
    *fetchById({ payload: { id } }, { call, put }) {
      const { data } = yield call(scheduleService.fetchById, id);
      if (data) {
        yield put({
          type: 'saveSchedule',
          payload: {
            schedule: data.data.body,
          },
        });
      }
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        dispatch({
          type: 'init',
        })
        if (pathname === '/schedule') {
          dispatch({ type: 'fetch', payload: query });
        }else if (pathname === '/schedule/edit') {
          dispatch({ type: 'fetchById', payload: query });
        }
      });
    },
  },
};
