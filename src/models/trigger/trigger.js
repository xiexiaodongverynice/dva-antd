import modelExtend from 'dva-model-extend';
import _ from 'lodash';
import * as baseModel from '../base';
import * as triggerService from '../../services/trigger';

// 列表数据请求
function* fetchPage(call, put, select) {
  const { body, object_describe_display_name } = yield select(state => state.trigger);
  const payload = { pageNo: body.pageNo, pageSize: body.pageSize, object_describe_display_name };
  const response = yield call(triggerService.fetchWithPage, payload);
  const responseBody = response.data.data.body;
  const result = [];
  responseBody.result.forEach((element) => {
    const triggers = element.triggers || [];
    if (_.isEmpty(triggers)) {
      element.trigger = null;
      delete element.triggers;
      element.rowSpan = 1;
      result.push(element);
    } else {
      triggers.forEach((trigger, index) => {
        const newElement = _.cloneDeep(element);
        newElement.trigger = trigger;
        delete newElement.triggers;
        if (index === 0) {
          newElement.rowSpan = triggers.length;
        } else {
          newElement.rowSpan = 0;
          newElement.uid = `${element.id}_${index}`; // uniq id
        }
        result.push(newElement);
      });
    }
  });
  responseBody.result = result;
  yield put({
    type: 'save',
    payload: {
      body: responseBody,
    },
  });
}

const initialState = {
  body: {
    result: [],
    pageNo: 1,
    pageSize: 10,
    resultCount: 0,
  },
  object_describe_display_name: '',
  loading: true,
}

export default modelExtend(baseModel, {
  namespace: 'trigger',
  state: Object.assign({}, initialState),
  reducers: {
    save(state, { payload: { body } }) {
      return { ...state, body };
    },
    // 保存分页信息(修改body中的分页信息貌似不妥,拿出去又麻烦。。。)
    savePage(state, { payload }) {
      return { ...state, body: Object.assign({}, state.body, payload) };
    },
  },
  effects: {
    // 请求分页数据
    *fetch({ payload }, { call, put, select }) {
      yield fetchPage(call, put, select);
    },
    // 开启触发器
    *open_transfer({ payload: { openObj } }, { call, put, select }) {
      const { data } = yield call(triggerService.open, openObj);
      if (data) {
        yield fetchPage(call, put, select);
      }
    },

    // 删除一个触发器
    *del_transfer({ payload: { id } }, { call, put, select }) {
      if (id) {
        const { data } = yield call(triggerService.del, id);
        if (data) {
          yield fetchPage(call, put, select);
        }
      }
    },
    // 按对象名称查询
    *search({ payload }, { put, call, select }) {
      yield put({
        type: 'assignState',
        payload,
      });
      // 查询时分页重置
      yield put({
        type: 'savePage',
        payload: {
          pageNo: 1,
          pageSize: 10,
        },
      });
      yield fetchPage(call, put, select);
    },
    *pageChange({ payload }, { call, put, select }) {
      yield put({
        type: 'savePage',
        payload,
      });
      yield fetchPage(call, put, select);
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/trigger') {
          dispatch({ type: 'fetch' });
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
