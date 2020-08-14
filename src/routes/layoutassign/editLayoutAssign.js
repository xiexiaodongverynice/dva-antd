/* eslint-disable no-undef */
import React from 'react';
import { connect } from 'dva';
import LayoutAssignForm from './form';

class EditLayoutAssign extends React.Component {

  render() {
    const { layout_assign, dispatch } = this.props;
    return (
      <LayoutAssignForm layoutAssign={layout_assign} dispatch={dispatch} />
    );
  }
}

function mapStateToProps(state) {
  const { layout_assign } = state.layout_assign;
  const loading = state.loading.models.layout_assign;
  return {
    layout_assign,
    loading,
  };
}

export default connect(mapStateToProps)(EditLayoutAssign);
