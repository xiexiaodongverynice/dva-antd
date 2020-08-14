/* eslint-disable no-undef */
import React from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
import ExportScriptEditor from '../../components/export_script/script_editor';

class EditExportScript extends React.Component {

  render() {
    const { script, dispatch, form, label_error } = this.props;
    return (
      <ExportScriptEditor mode="edit" script={script} dispatch={dispatch} form={form}/>
    );
  }
}

function mapStateToProps(state) {
  const { script } = state.data_export_script_edit;
  const loading = state.loading.models.data_export_script_edit;
  return {
    script,
    loading,
  };
}

export default connect(mapStateToProps)(Form.create({
  onValuesChange: (props, values) => {
    const { dispatch } = props;
    dispatch({
      type: 'data_export_script_edit/updateScript',
      payload: values,
    });
  },
})(EditExportScript));
