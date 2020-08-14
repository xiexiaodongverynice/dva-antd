/**
 * Created by xinli on 06/06/2017.
 */
import React from 'react';
import { connect } from 'dva';
import { hashHistory, routerRedux } from 'dva/router';
import { Table, Button, Popconfirm, Alert, Modal } from 'antd';
import DataReportPortalDistributionModal from './DataReportPortalDistributionModal';
import styles from '../../styles/list.less';

function handleAddData() {
  hashHistory.push('/approval_flow/add');
}

const ApprovalFlowList = ({
                            loading,
                            body,
                            showInitModal,
                            dispatch,
                            currentItem = {},
                            modalDistributionVisible = false,
                            confirmLoading = false,
                          }) => {
  function editPage(record) {
    const { id, label } = record;
    dispatch(routerRedux.push({
      pathname: '/approval_flow/edit',
      query: { id },
      state: {
        parentName: label,
      },
    }));
  }

  function delPage(id) {
    dispatch({ type: 'approval_flow/remove', payload: { id } });
  }

  function displayInitModal() {
    dispatch({
      type: 'approval_flow/save',
      payload: {
        body,
        showInitModal: true,
      },
    });
  }

  function hideInitModal() {
    dispatch({
      type: 'approval_flow/save',
      payload: {
        body,
        showInitModal: false,
      },
    });
  }

  function handleApprovalFlowInit() {
    dispatch({
      type: 'approval_flow/initApprovalFlow',
    });
  }
  function onDistributionItem(record) {
    dispatch({
      type: 'approval_flow/changeDistributionModal',
      payload: {
        currentItem: record,
        modalDistributionVisible: true,
      },
      callback: () => {}, // this.queryRecordList,
    });
  }

  const columns = [{
    title: '名称',
    key: 'name',
    dataIndex: 'name',
  }, {
    title: 'API Name',
    dataIndex: 'api_name',
    key: 'api_name',
  }, {
    title: '相关对象',
    dataIndex: 'object_describe_api_name',
    key: 'object_describe_api_name',
  }, {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  }, {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a onClick={editPage.bind(null, record)}>编辑</a>
        <span className="ant-divider" />
        <a onClick={onDistributionItem.bind(null, record)}>分配</a>
        <span className="ant-divider" />
        <Popconfirm title="确认要删除此工作流定义?" onConfirm={delPage.bind(null, record.id)}>
          <a>删除</a>
        </Popconfirm>
      </span>
    ),
  }];

  const modalDistributionProps = {
    item: currentItem,
    visible: modalDistributionVisible,
    maskClosable: false,
    width: 700,
    confirmLoading,
    title: '审批流简档分配',
    wrapClassName: 'vertical-center-modal',
    onOk: (approval_flow_api_name, data) => {
      // console.log(approval_flow_api_name,data)
      dispatch({
        type: 'approval_flow/assign',
        payload: { approval_flow_api_name, data },
        callback: () => {
          dispatch({
            type: 'approval_flow/changeDistributionModal',
            payload: { modalDistributionVisible: false },
          });
          // dispatch({ type: 'approval_flow/fetch', payload: {} });
        },
      });
    },
    onCancel() {
      dispatch({
        type: 'approval_flow/changeDistributionModal',
        payload: { modalDistributionVisible: false },
      });
    },
  };

  return (
    <div>
      <Modal
        title="初始化审批流"
        visible={showInitModal}
        onCancel={hideInitModal.bind(this)}
        onOk={handleApprovalFlowInit.bind(this)}
      >
        <Alert
          message="注意"
          description="初始化审批流将重新创建与审批流相关数据表和业务对象，如果已有相关数据将会全部删除，是否继续"
          type="warning"
          showIcon
        />

      </Modal>
      <div className={styles.mybutton}>
        <Button onClick={displayInitModal.bind(this)}>初始化审批流</Button>
        <Button type="primary" onClick={handleAddData}>新建审批流</Button>
      </div>
      <Table
        rowKey={record => record.id} columns={columns}
        pagination={false}
        dataSource={body} loading={loading}
      />

      {modalDistributionVisible && (
        <DataReportPortalDistributionModal {...modalDistributionProps} />
      )}

    </div>
  );
};

function mapStateToProps(state) {
  const { body, showInitModal, currentItem, modalDistributionVisible,confirmLoading } = state.approval_flow;
  return {
    body,
    showInitModal,
    currentItem,
    modalDistributionVisible,
    confirmLoading,
  };
}

export default connect(mapStateToProps)(ApprovalFlowList);
