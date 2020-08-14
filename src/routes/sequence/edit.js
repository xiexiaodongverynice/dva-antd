import React, { Component } from 'react';
import { connect } from 'dva';
import SequenceForm from './form';

class SequenceEdit extends Component {
  componentWillMount() {
    // this.props.dispatch({
    //   type: 'sequence/fetchCustomObjects',
    // });
  }

  render() {
    const { sequence, location, dispatch } = this.props;
    return (
      <div style={{ padding: 24, background: '#fff', minHeight: 525 }} >
        <SequenceForm
          sequence={sequence} location={location} dispatch={dispatch}
        />
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

export default connect(mapStateToProps)(SequenceEdit);
