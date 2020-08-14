import React, { Component } from 'react';
import { connect } from 'dva';
import ActionScriptForm from './form';

class ApprovalFlowAdd extends Component {

  render() {
    const { approval_flow, object_describes, location, dispatch } = this.props;
    return (
      <div style={{ padding: 24, background: '#fff', minHeight: 525 }} >
        <ActionScriptForm
          approval_flow={approval_flow} location={location} dispatch={dispatch} object_describes={object_describes}
        />
      </div>
    );
  }

}

function mapStateToProps(state) {
  const { approval_flow, object_describes } = state.approval_flow;
  return {
    loading: 'loading',
    approval_flow,
    object_describes,
  };
}

export default connect(mapStateToProps)(ApprovalFlowAdd);
