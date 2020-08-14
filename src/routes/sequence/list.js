/**
 * Created by xinli on 06/06/2017.
 */
import React from 'react';
import { connect } from 'dva';
import { hashHistory, routerRedux } from 'dva/router';
import { Table, Button, Popconfirm, Tag } from 'antd';

import styles from '../../styles/list.less';
// import TabList from '../../components/tab/list';

function handleAddData() {
  hashHistory.push('/sequence/add');
}

const SequenceList = ({
                   loading,
                   body,
                   dispatch,
                 }) => {
  function editPage(record) {
    const { id, label } = record;
    dispatch(routerRedux.push({
      pathname: '/sequence/edit',
      query: { id },
      state: {
        parentName: label,
      },
    }));
  }

  function resetPage(record) {
    const { id, label } = record;
    dispatch(routerRedux.push({
      pathname: '/sequence/reset',
      query: { id },
      state: {
        parentName: label,
      },
    }));
  }
  function delPage(id) {
    dispatch({ type: 'sequence/deleteSequence', payload: { id } });
  }

  // eslint-disable-next-line no-unused-vars
  function allotPage(id) {
    dispatch(routerRedux.push({
      pathname: 'role/distribution',
      query: { id },
    }));
  }

  const columns = [{
    title: 'Label',
    key: 'label',
    dataIndex: 'label',
    // render: (text, record) => (
    //   <a onClick={detailPage.bind(null, record.id)}>{record.label}</a>
    // ),
  }, {
    title: 'API Name',
    dataIndex: 'api_name',
    key: 'api_name',
  }, {
    title: '最小值',
    dataIndex: 'min_value',
    key: 'min_value',
  }, {
    title: '最大值',
    dataIndex: 'max_value',
    key: 'max_value',
  }, {
    title: '初始值',
    dataIndex: 'start_value',
    key: 'start_value',
  }, {
    title: '自增步长',
    dataIndex: 'increment',
    key: 'increment',
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
        <span className="ant-divider" />
        <a onClick={resetPage.bind(null, record)}>重置</a>
      </span>
    ),
  }];
  return (
    <div>
      <div className={styles.mybutton}>
        <Button type="primary" onClick={handleAddData}>新建序列</Button>
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
  const { body } = state.sequence;
  return {
    body,
  };
}

export default connect(mapStateToProps)(SequenceList);
