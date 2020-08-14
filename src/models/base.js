export default {
  reducers: {
    assignState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
