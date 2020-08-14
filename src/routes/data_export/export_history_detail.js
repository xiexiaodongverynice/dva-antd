/* eslint-disable no-undef */
import React from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
import ExportScriptEditor from '../../components/export_script/script_editor';

class ExportScriptDetail extends React.Component {

  render() {
    const { script, dispatch, form, label_error } = this.props;
    return (
      <ExportScriptEditor mode="detail" script={script} dispatch={dispatch} form={form}/>
    );
  }
}

function mapStateToProps(state) {
  const { script } = state.data_export_history_detail;
  const loading = state.loading.models.data_export_history_detail;
  return {
    script,
    loading,
  };
}

export default connect(mapStateToProps)(Form.create()(ExportScriptDetail));
