import React, { Component } from 'react';
import { connect } from 'dva';
import ActionScriptForm from './form';

class ActionScriptAdd extends Component {

  render() {
    const { action_script, location, dispatch } = this.props;
    return (
      <div style={{ padding: 24, background: '#fff', minHeight: 525 }} >
        <ActionScriptForm
          action_script={action_script} location={location} dispatch={dispatch}
        />
      </div>
    );
  }

}

function mapStateToProps(state) {
  const { action_script } = state.action_script;
  return {
    loading: 'loading',
    action_script,
  };
}

export default connect(mapStateToProps)(ActionScriptAdd);
