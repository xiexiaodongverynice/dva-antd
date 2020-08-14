import React, { Component } from 'react';
import { connect } from 'dva';

import TabForm from '../../components/tab/form';


class TabEdit extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'nav_tabs/fetchCustomObjects',
    });
    const id = this.props.location.query.id;
    this.props.dispatch({
      type: 'nav_tabs/fetchTab',
      payload: {
        id,
      },
    });
  }

  render() {
    const { tab, location, dispatch, customObjects } = this.props;
    return (
      <div style={{ padding: 24, background: '#fff', minHeight: 525 }}>
        <TabForm tab={tab} dispatch={dispatch} location={location} customObjects={customObjects} selectedObjectApiName={tab.object_describe_api_name} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { tab, customObjects } = state.nav_tabs;
  return {
    loading: state.loading.models.nav_tabs,
    tab,
    customObjects,
  };
}

export default connect(mapStateToProps)(TabEdit);
