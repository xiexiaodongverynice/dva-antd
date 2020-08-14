import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Popconfirm, Tooltip, Row, Col, Button, Tag } from 'antd';
import { arrayToTree } from '../../utils/index';
import SortTableLayout from '../../components/tab/SortTableLayout';

class TabsLayout extends Component {

  state={
    tabsData: [],
  }

  componentDidMount() {
    // console.log('da');
    const { tabsList } = this.props;
    this.sortTabsData(tabsList);
  }

  componentWillReceiveProps = (nextProps) => {
    const { tabsList } = nextProps;
    console.log('will receive props===>', tabsList);
    this.sortTabsData(tabsList);
  };

  onOk =(values) => {
    const resultData = this.formatter(values);
    // console.log(values);
    console.log(resultData);

    this.props.dispatch({
      type: 'nav_tabs/updateTabs',
      payload: { resultData },
    });
  }

  formatter=(data, pRecord = {}) => {
    const pApiName = _.get(pRecord, 'api_name', '');
    const resultData = [];
    data.forEach((item, index) => {
      const tabRecord = item.tabRecord;

      const { id, version, api_name, label, p_api_name: oldPApiName = '', display_order: oldDisplayOrder } = tabRecord;

      const result = { id, label, version, p_api_name: pApiName, display_order: index };
      if (_.has(item, 'children')) {
        const children = item.children;
        resultData.push(...this.formatter(children, tabRecord));
      }
      if (oldPApiName == pApiName && oldDisplayOrder == index) {
        return;
      }
      resultData.push(result);
    });
    return resultData;
  }

  sortTabsData=(tabsList) => {
    const arrayTreeData = [];
    // console.log('tabsList==>', tabsList);
    _.forEach(_.sortBy(tabsList, ['display_order']), (tab) => {
      const { type } = tab;

      const isSubMenu = type === 'sub_menu';
      arrayTreeData.push({
        title: tab.label,
        // subtitle: tab.api_name,
        subtitle: (
          <span style={{ paddingTop: 3 }}>
            {!isSubMenu && <Tag>{tab.api_name}</Tag>}
            {!isSubMenu && <Tag>{_.get(tab, 'record_type', 'master')}</Tag>}
            {!isSubMenu && <Tag>{type}</Tag>}
            {!isSubMenu && <Tag color={_.get(tab, 'define_type', 'custom') == 'system' ? 'red' : 'green'}>{_.get(tab, 'define_type', 'custom')}</Tag>}
            {isSubMenu && <span>这是一个普通的父菜单项，没有任何跳转功能</span>}
          </span>
        ),
        expanded: true,
        api_name: tab.api_name,
        p_api_name: _.get(tab, 'p_api_name', ''),
        tabRecord: tab,
      });
    });

    const dataTree = arrayToTree(arrayTreeData, 'api_name', 'p_api_name');
    console.log('dataTree===>', dataTree);
    this.setState({ tabsData: dataTree });
    // return tabsData;
  }

  render() {
    const { dispatch } = this.props;
    const { tabsData } = this.state;
    return (<div>
      {!_.isEmpty(tabsData) && <SortTableLayout tabsData={tabsData} dispatch={dispatch} onOk={this.onOk} />}
      {_.isEmpty(tabsData) && <span>暂无数据</span>}
    </div>);
  }
}


function mapStateToProps(state) {
  const { body } = state.nav_tabs;
  return {
    // loading: 'loading',
    tabsList: body,
  };
}

export default connect(mapStateToProps)(TabsLayout);
