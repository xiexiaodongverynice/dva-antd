import React, { Component } from 'react';
import { connect } from 'dva';
import SequenceResetForm from './resetForm';

class SequenceReset extends Component {
  render() {
    const { sequence, location, dispatch } = this.props;
    return (
      <div style={{ padding: 24, background: '#fff', minHeight: 525 }} >
        <SequenceResetForm sequence={sequence} location={location} dispatch={dispatch} />
      </div>
    );
  }

}

function mapStateToProps(state) {
  const { customObjects, selectedObjectApiName, sequence } = state.sequence;
  return {
    loading: 'loading',
    sequence,
    customObjects,
    selectedObjectApiName,
  };
}

export default connect(mapStateToProps)(SequenceReset);
