export default {
  reducers: {
    updateKpiDef: (state, { payload }) => {
      return { ...state, kpiDef: Object.assign({}, state.kpiDef, payload) };
    },
  },
};
