import React, { Component } from 'react';
import { connect } from 'dva';
import SecurityForm from './form';

class SecurityCheck extends Component {

  onOk=(baseData, securityCheckDefinitionData) => {
    console.log(baseData, securityCheckDefinitionData);

    this.props.dispatch({
      type: 'security_check/create',
      payload: {
        ...baseData,
        security_check_definition: JSON.stringify(securityCheckDefinitionData),
      },
    });
  }

  render() {
    const { security_check, location, dispatch, children } = this.props;
    return (
      <div style={{ padding: 24, background: '#fff', minHeight: 525 }} >
        <SecurityForm dispatch={dispatch} onOk={this.onOk} record={{}} />
      </div>
    );
  }

}

function mapStateToProps(state) {
  const { security_check } = state.security_check;
  return {
    loading: 'loading',
    security_check,
  };
}

export default connect(mapStateToProps)(SecurityCheck);
