/**
 * Created by xinli on 13/06/2017.
 */
import pathToRegexp from 'path-to-regexp';
import * as describeService from '../../services/customObjects';

// subscriptions -> effects -> reducers
export default {
  namespace: 'object_detail',
  state: {
    record: {
      id: 132,
      name: 'alex',
      create_by: 'lalala',
    },
    describe: {
      api_name: 'Test',
      display_name: '测试对象',
      fields: [
        {
          api_name: 'id',
          label: 'ID',
          type: 'BIGINT',
        },
        {
          api_name: 'name',
          label: '名称',
          type: 'TEXT',
        },
      ],
    },
    layout: {
    },
    loading: true,
  },
  reducers: {
    saveDescribe(state, { payload: { describe } }) {
      return { ...state, describe };
    },
  },
  effects: {
    *fetchDescribe({ payload }, { call, put }) {
      const { data } = yield call(describeService.fetchByApiName, payload);
      console.log(data);
      yield put({
        type: 'saveDescribe',
        payload: { describe: data },
      });
    },
    *fetchLayout({ payload }/* , { call, put }*/) {  /* eslint require-yield: [0] */
      console.log('fetchLayout');
      console.log(payload);
      // const { data } = yield call(userService.fetch, payload);
      // const { body, head, pageNo, resultCount, pageSize } = data.data;
      // yield put({
      //   type: 'save',
      //   payload: { body, head, pageNo, resultCount, pageSize },
      // });
    },
    *fetchRecord({ payload }/* , { call, put }*/) { /* eslint require-yield: [0] */
      console.log('fetchRecord');
      console.log(payload);
      // const { data } = yield call(userService.fetch, payload);
      // const { body, head, pageNo, resultCount, pageSize } = data.data;
      // yield put({
      //   type: 'save',
      //   payload: { body, head, pageNo, resultCount, pageSize },
      // });
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        const match = pathToRegexp('/object_page/:object_api_name/:record_id/detail').exec(pathname);
        console.log(match);
        if (match) {
          // alert({ id: match[1] })
          // dispatch({ type: 'query', payload: { id: match[1] } })
          // dispatch({ type: 'fetch', payload: { objId: match[1],query }  });
          dispatch({ type: 'fetch', payload: { pageNo: 1, pageSize: 10 } });
          // this.props.objIdd="123456";
        }
      });
    },
  },
};
