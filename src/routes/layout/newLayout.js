/* eslint-disable no-undef */
import React from 'react';
import { connect } from 'dva';
import LayoutEditor from '../../components/layout/layoutEditor';

class NewLayout extends React.Component {

  render() {
    const { layout, dispatch } = this.props;
    console.log(this.props);
    return (
      <LayoutEditor mode="new" layout={layout} dispatch={dispatch} />
    );
  }
}

function mapStateToProps(state) {
  const { layout } = state.newLayout;
  const loading = state.loading.models.newLayout;
  return {
    layout,
    loading,
  };
}

export default connect(mapStateToProps)(NewLayout);
