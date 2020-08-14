import React, { PureComponent } from 'react';
import _ from 'lodash';
import { Transfer, Modal, Spin } from 'antd';
import * as simpleProfileService from '../../services/simpleProfile';
import * as approvalFlowAssignService from '../../services/approvalFlowAssign';

export default class DataReportPortalDistributionModal extends PureComponent {
  state = {
    mockData: [],
    targetKeys: [],
    targetKeysResult: [],
    loading: false,
    confirmLoading: false,
  };
  componentDidMount() {
    this.getMock();
  }
  getMock = () => {
    const { item } = this.props;
    const targetKeys = [];
    const mockData = [];

    const queryDataDeal = {
      // joiner: 'and',
      // criterias: [],
      orderBy: 'name',
      order: 'asc',
      pageNo: 1,
      pageSize: 10,
      // objectApiName: 'profile',
    };
    this.setState({ loading: true });
    this.promise = simpleProfileService.getSimpleProfile({ ...queryDataDeal }).then((result) => {
      const resultData = _.get(result, 'data.data.body.result');// 为什么返回这么多data，醉了……
      // console.log('profile result data===>', result, resultData);
      _.forEach(resultData, (profileData) => {
        const data = {
          key: _.toString(profileData.api_name),
          title: profileData.name,
          // description: `description of content${i + 1}`,
          chosen: _.indexOf(_.get(item, 'profile'), _.toString(profileData.id)) >= 0,
        };
        mockData.push(data);
      });
      this.setState({ mockData, loading: false });
    }).catch((error) => {
      console.error(error);
      this.setState({ loading: false });
    });


    this.promise = approvalFlowAssignService.fetch({ approvalFlowApiName: item.api_name }).then((result) => {
      const resultData = _.get(result, 'data.data.body.items');// 为什么返回这么多data，醉了……
      console.log('approval assign result data===>', result, resultData);
      _.forEach(resultData, (approvalFlowAssign) => {
        targetKeys.push(approvalFlowAssign.profile_api_name);
      });
      this.setState({ targetKeys, targetKeysResult: targetKeys, approvalFlowAssignResult: resultData });
    });
  };
  handleChange = (targetKeys, direction, moveKeys) => {
    console.log(targetKeys, direction, moveKeys);
    this.setState({ targetKeys });
  };
  handleOk = () => {
    // this.setState({ confirmLoading: true });
    const { item } = this.props;
    const { mockData, approvalFlowAssignResult, targetKeys, targetKeysResult } = this.state;
    const { onOk } = this.props;

    const assignKeys = _.difference(targetKeys, targetKeysResult);
    const removeKeys = _.difference(targetKeysResult, targetKeys);

    // TODO 没有想通怎么获取新增、删除的
    // console.log(targetKeysResult, targetKeys);
    console.log('assignKeys==>', assignKeys);
    console.log('removeKeys==>', removeKeys);

    const profileNameData = assignKeys.map((key) => {
      const profile = _.get(_.find(mockData, { key }), 'title');
      return profile;
    });
    const assignData = _.zipObject(assignKeys, profileNameData);

    const removeIds = removeKeys.map((key) => {
      const id = _.get(_.find(approvalFlowAssignResult, { profile_api_name: key }), 'id');
      return id;
    });

    const data = {
      objectApiName: _.get(item, 'flow_definition.ref_object_api_name'),
      recordType: _.get(item, 'flow_definition.ref_object_record_type'),
      assign: assignData,
      cancel: removeIds,
    };
    console.log('data==>', data);
    // console.log('assignData==>', assignData);
    onOk(item.api_name, data);
  };

  renderItem = (item) => {
    const customLabel = (
      <span className="custom-item">
        {item.title}
        {item.description}
      </span>
    );

    return {
      label: customLabel, // for displayed item
      value: item.title, // for title and filter matching
    };
  };

  render() {
    const { ...modalDistributionProps } = this.props;
    const { loading } = this.state;
    const modalOpts = {
      ...modalDistributionProps,
      onOk: this.handleOk,
    };
    // console.log('modalOpts item===>', modalOpts.item);
    return (
      <Modal
        {...modalOpts}
      >
        <Transfer
          dataSource={this.state.mockData}
          showSearch
          listStyle={{
            width: 300,
            height: 300,
          }}
          targetKeys={this.state.targetKeys}
          onChange={this.handleChange}
          render={this.renderItem}
          notFoundContent={loading && <Spin />}
        />
      </Modal>
    );
  }
}
