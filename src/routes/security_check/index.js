/**
 * Created by xinli on 06/06/2017.
 */
import React from 'react';
import _ from 'lodash';
import { Link } from 'dva/router';
import { connect } from 'dva';
import { hashHistory, routerRedux } from 'dva/router';
import { Table, Button, Popconfirm, Alert, Modal } from 'antd';
// import DataReportPortalDistributionModal from '../approval_flow/DataReportPortalDistributionModal';
import styles from '../../styles/list.less';

function handleAddData() {
  hashHistory.push('/security_check/add');
}

const SecurityCheckList = ({
                             loading,
                             body,
                             needShowEnableButton,
                             showInitModal,
                             dispatch,
                             // currentItem = {},
                             // modalDistributionVisible = false,
                             // confirmLoading = false,
                           }) => {
  function editPage(record) {
    console.log('edit page record');
    const { id, label } = record;
    dispatch(routerRedux.push({
      pathname: '/security_check/edit',
      query: { id },
      // state: {
      //   parentName: label,
      // },
    }));
  }

  function delPage(id) {
    dispatch({ type: 'security_check/remove', payload: { id } });
  }

  function displayInitModal() {
    dispatch({
      type: 'security_check/success',
      payload: {
        showInitModal: true,
      },
    });
  }

  function hideInitModal() {
    dispatch({
      type: 'security_check/success',
      payload: {
        showInitModal: false,
      },
    });
  }

  function handleInitSecurityCheckInit() {
    dispatch({
      type: 'security_check/initSecurityCheck',
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
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  }, {
    title: '是否启用',
    dataIndex: 'is_active',
    key: 'is_active',
    render: (text) => {
      return text ? '是' : '否';
    },
  }, {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <Link to={`security_check/edit?id=${record.id}`}>编辑</Link>
        {/* <a onClick={editPage.bind(null, record)}>编辑</a>*/}
        {/* <span className="ant-divider" />*/}
        {/* <a onClick={onDistributionItem.bind(null, record)} disabled>分配</a>*/}
        {
          record.api_name !== 'security_check_default' &&
          (
            <span className="ant-divider" />
          )
        }
        {
          record.api_name !== 'security_check_default' &&
          (
          <Popconfirm title="确认要删除此工作流定义?" onConfirm={delPage.bind(null, record.id)}>
            <a>删除</a>
          </Popconfirm>
          )
        }

      </span>
    ),
  }];
  return (
    <div>
      <Modal
        title="初始化安全策略"
        visible={showInitModal}
        onCancel={hideInitModal.bind(this)}
        onOk={handleInitSecurityCheckInit.bind(this)}
      >
        <Alert
          message="注意"
          description="初始化安全策略，是否继续"
          type="warning"
          showIcon
        />

      </Modal>
      <div className={styles.mybutton}>
        {needShowEnableButton && <Button onClick={displayInitModal.bind(this)}>初始化安全策略</Button>}
        {/* <Button type="primary" onClick={handleAddData}>新建安全策略</Button>*/}
      </div>
      <Table
        rowKey={record => record.id} columns={columns}
        pagination={false}
        dataSource={body} loading={loading}
      />

      {/* {modalDistributionVisible && (
        <DataReportPortalDistributionModal {...modalDistributionProps} />
      )}*/}

    </div>
  );
};

function mapStateToProps(state) {
  const { body, needShowEnableButton, showInitModal, currentItem, modalDistributionVisible, confirmLoading } = state.security_check;
  return {
    body,
    needShowEnableButton,
    showInitModal,
    currentItem,
    modalDistributionVisible,
    confirmLoading,
  };
}

export default connect(mapStateToProps)(SecurityCheckList);
