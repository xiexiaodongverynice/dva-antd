/* eslint-disable no-undef */
import React from 'react';
import { connect } from 'dva';
import LayoutEditor from '../../components/layout/layoutEditor';

class EditLayout extends React.Component {

  render() {
    const { layout, dispatch } = this.props;
    console.log(this.props);
    return (
      <LayoutEditor mode="edit" layout={layout} dispatch={dispatch} />
    );
  }
}

function mapStateToProps(state) {
  const { layout } = state.editLayout;
  const loading = state.loading.models.editLayout;
  return {
    layout,
    loading,
  };
}

export default connect(mapStateToProps)(EditLayout);
