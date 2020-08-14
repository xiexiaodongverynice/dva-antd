
// subscriptions -> effects -> reducers
export default {
  namespace: 'home',
  state: {
    body: {},
    head: {},
  },
  reducers: {
    save(state, { payload: body }) {
      return { ...state, body };
    },
  },
  effects: {
    *fetch({ payload }, { put }) {
    /*  const {data} = yield call(userService.fetch, payload);
      const {body, head} = data.data;*/
      const body = { startDate: '2017-5-25' };
      console.log(body);
      yield put({
        type: 'save',
        payload: body,
      });
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/home') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};
