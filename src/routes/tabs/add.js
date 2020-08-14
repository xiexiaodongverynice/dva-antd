import React, { Component } from 'react';
import { connect } from 'dva';
import TabForm from '../../components/tab/form';

class TabAdd extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'nav_tabs/fetchCustomObjects',
    });
  }

  render() {
    const { tab, location, dispatch, customObjects, selectedObjectApiName } = this.props;
    return (
      <div style={{ padding: 24, background: '#fff', minHeight: 525 }} >
        <TabForm
          tab={tab} location={location} dispatch={dispatch}
          customObjects={customObjects} selectedObjectApiName={selectedObjectApiName}
        />
      </div>
    );
  }

}

function mapStateToProps(state) {
  const { customObjects, selectedObjectApiName } = state.nav_tabs;
  return {
    loading: 'loading',
    tab: {
      label: '',
      api_name: '',
      type: 'object_index', // 暂时只支持这一种
      object_describe_api_name: '',
    },
    customObjects,
    selectedObjectApiName,
  };
}

export default connect(mapStateToProps)(TabAdd);
