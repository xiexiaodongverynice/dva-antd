export default {
  reducers: {
    save(state, { payload: { body, head } }) {
      const { pageNo, resultCount, pageSize } = body;
      return { ...state, body, head, pageNo, resultCount, pageSize };
    },
  },
};
