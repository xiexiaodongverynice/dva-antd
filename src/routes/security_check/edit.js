import React, { Component } from 'react';
import { connect } from 'dva';
import SecurityForm from './form';

class SecurityCheck extends Component {

  onOk=(baseData, securityCheckDefinitionData) => {
    console.log(baseData, securityCheckDefinitionData);

    this.props.dispatch({
      type: 'security_check/update',
      payload: {
        security_check: {
          ...baseData,
          security_check_definition: JSON.stringify(securityCheckDefinitionData),
        },
      },
    });
  }

  render() {
    const { record, dispatch } = this.props;
    return (
      <div style={{ padding: 24, background: '#fff', minHeight: 525 }} >
        <SecurityForm dispatch={dispatch} onOk={this.onOk} record={record} />
      </div>
    );
  }

}

function mapStateToProps(state) {
  const { record } = state.security_check;
  return {
    loading: 'loading',
    record,
  };
}

export default connect(mapStateToProps)(SecurityCheck);
