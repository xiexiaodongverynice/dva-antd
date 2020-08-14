import React, { Component } from 'react';
import { connect } from 'dva';
import ScheduleForm from './form';

class ScheduleEdit extends Component {

  render() {
    const { schedule, location, dispatch } = this.props;
    return (
      <div style={{ padding: 24, background: '#fff', minHeight: 525 }} >
        <ScheduleForm
          schedule={schedule} location={location} dispatch={dispatch}
        />
      </div>
    );
  }

}

function mapStateToProps(state) {
  const { schedule } = state.schedule;
  return {
    loading: 'loading',
    schedule,
  };
}

export default connect(mapStateToProps)(ScheduleEdit);
