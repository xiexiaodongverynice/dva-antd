import React, { Component } from 'react';
import { connect } from 'dva';
import RecordDetail from '../../components/dataRecord/recordDetail';

class ObjectDetail extends Component {

  componentWillMount() {
    const { object_api_name, record_id } = this.props.params;
    this.props.dispatch({
      type: 'object_detail/fetchDescribe',
      payload: {
        object_api_name,
      },
    });
    this.props.dispatch({
      type: 'object_detail/fetchRecord',
      payload: {
        object_api_name,
        record_id,
      },
    });
    this.props.dispatch({
      type: 'object_detail/fetchLayout',
      payload: {
        object_api_name,
      },
    });
  }

  render() {
    const { record, describe, layout } = this.props;
    return (
      <div style={{ padding: 24, background: '#fff', minHeight: 525 }}>
        <RecordDetail record={record} describe={describe} layout={layout} />
      </div>
    );
  }
}


function mapStateToProps(state) {
  const { record, describe, layout } = state.object_detail;
  const loading = 'xxx';
  return {
    record, loading, describe, layout,
  };
}
export default connect(mapStateToProps)(ObjectDetail);
