/* eslint-disable no-undef */
import React from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
import KpiDefEditor from '../../components/kpidef/kpiDefEditor';

class NewKPIDef extends React.Component {

  render() {
    const { kpiDef, dispatch, form } = this.props;
    return (
      <KpiDefEditor mode="new" kpiDef={kpiDef} dispatch={dispatch} form={form}/>
    );
  }
}

function mapStateToProps(state) {
  const { kpiDef } = state.kpi_def_new;
  const loading = state.loading.models.kpi_def_new;
  return {
    kpiDef,
    loading,
  };
}

export default connect(mapStateToProps)(Form.create({
  onValuesChange: (props, values) => {
    const { dispatch } = props;
    dispatch({
      type: 'kpi_def_new/updateKpiDef',
      payload: values,
    });
  },
})(NewKPIDef));
