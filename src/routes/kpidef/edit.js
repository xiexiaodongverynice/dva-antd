/* eslint-disable no-undef */
import React from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
import KpiDefEditor from '../../components/kpidef/kpiDefEditor';

class EditKPIDef extends React.Component {

  render() {
    const { kpiDef, dispatch, form } = this.props;
    return (
      <KpiDefEditor mode="edit" kpiDef={kpiDef} dispatch={dispatch} form={form}/>
    );
  }
}

function mapStateToProps(state) {
  const { kpiDef } = state.kpi_def_update;
  const loading = state.loading.models.kpi_def_update;
  return {
    kpiDef,
    loading,
  };
}

export default connect(mapStateToProps)(Form.create({
  onValuesChange: (props, values) => {
    const { dispatch } = props;
    dispatch({
      type: 'kpi_def_update/updateKpiDef',
      payload: values,
    });
  },
})(EditKPIDef));
