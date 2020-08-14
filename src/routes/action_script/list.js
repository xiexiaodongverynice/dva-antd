/**
 * Created by xinli on 06/06/2017.
 */
import React from 'react';
import { connect } from 'dva';
import { hashHistory, routerRedux } from 'dva/router';
import { Table, Button, Popconfirm, Tag } from 'antd';

import styles from '../../styles/list.less';

function handleAddData() {
  hashHistory.push('/action_script/add');
}

const ActionScriptList = ({
                   loading,
                   body,
                   dispatch,
                 }) => {
  function editPage(record) {
    const { id, label } = record;
    dispatch(routerRedux.push({
      pathname: '/action_script/edit',
      query: { id },
      state: {
        parentName: label,
      },
    }));
  }

  function delPage(id) {
    dispatch({ type: 'action_script/remove', payload: { id } });
  }

  const columns = [{
    title: '名称',
    key: 'name',
    dataIndex: 'name',
    // render: (text, record) => (
    //   <a onClick={detailPage.bind(null, record.id)}>{record.label}</a>
    // ),
  }, {
    title: 'API Name',
    dataIndex: 'api_name',
    key: 'api_name',
  }, {
    title: 'API版本',
    dataIndex: 'api_version',
    key: 'api_version',
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
        <Popconfirm title="确认要删除此序列?" onConfirm={delPage.bind(null, record.id)}>
          <a>删除</a>
        </Popconfirm>
      </span>
    ),
  }];
  return (
    <div>
      <div className={styles.mybutton}>
        <Button type="primary" onClick={handleAddData}>新建Action脚本</Button>
      </div>
      <Table
        rowKey={record => record.id} columns={columns}
        pagination={false}
        dataSource={body} loading={loading}
      />
    </div>
  );
};

function mapStateToProps(state) {
  const { body } = state.action_script;
  return {
    body,
  };
}

export default connect(mapStateToProps)(ActionScriptList);
