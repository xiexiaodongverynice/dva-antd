import React, { Component } from 'react';
import { connect } from 'dva';
import ActionScriptForm from './customActionForm';

class CustomActionEdit extends Component {

  render() {
    const { object, location, dispatch } = this.props;
    return (
      <div style={{ padding: 24, background: '#fff', minHeight: 525 }} >
        <ActionScriptForm
          object={object} location={location} dispatch={dispatch}
        />
      </div>
    );
  }

}

function mapStateToProps(state) {
  const { object } = state.custom_action;
  return {
    loading: 'loading',
    object,
  };
}

export default connect(mapStateToProps)(CustomActionEdit);
