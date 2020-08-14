/* eslint no-return-assign: [0]*/
export default {
  namespace: 'App',
  state: {
    collapsed: false,
  },
  reducers: {
    isswitch(state, { payload: collapseds }) {
      const a = {
        collapsed: collapseds,
      };
      return state = a;
    },
  },
};
