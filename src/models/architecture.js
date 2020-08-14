import * as architectureService from '../services/architecture';

export default {
  namespace: 'architecture',
  state: {
    body: [],
  },
  reducers: {
    save(state, { payload: { body, pageNo, resultCount, pageSize } }) {
      return { ...state, body, pageNo, resultCount, pageSize };
    },
  },
  effects: {
    *territory({ payload: values }, { call }) {
      const { data } = yield call(architectureService.upload);
      console.log(data);
    },
  },
};
