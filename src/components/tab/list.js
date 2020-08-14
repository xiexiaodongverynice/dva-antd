import React from 'react';
import { connect } from 'dva';
import { hashHistory, routerRedux } from 'dva/router';
import { Table, Button, Popconfirm, Tag, Input, Row, Col } from 'antd';
import _ from 'lodash';

import styles from './styles.less';

const Search = Input.Search;
function handleAddData() {
  hashHistory.push('/tabs/add');
}
function handleLayout() {
  hashHistory.push('/tabs/layout');
}
const TabList = ({ loading, body, dispatch }) => {
  function editPage(record) {
    const { id, label } = record;
    dispatch(
      routerRedux.push({
        pathname: '/tabs/edit',
        query: { id },
        state: {
          parentName: label,
        },
      }),
    );
  }

  // function detailPage(id) {
  //   dispatch(
  //     routerRedux.push({
  //       pathname: '/tabs/detail', // 没这个功能，页面会找不到页面
  //       query: { id },
  //     }),
  //   );
  // }

  function delPage(id) {
    dispatch({ type: 'nav_tabs/deleteTab', payload: { id } });
  }

  // eslint-disable-next-line no-unused-vars
  function allotPage(id) {
    dispatch(
      routerRedux.push({
        pathname: 'role/distribution',
        query: { id },
      }),
    );
  }

  function handleSearch(value) {
    dispatch({
      type: 'nav_tabs/fetch',
      payload: {
        label: _.trim(value),
      },
    });
  }

  const columns = [
    {
      title: 'Label',
      key: 'label',
      dataIndex: 'label',
      // render: (text, record) => (
      //   <a onClick={detailPage.bind(null, record.id)}>{record.label}</a>
      // ),
    },
    {
      title: 'API_NAME',
      dataIndex: 'api_name',
      key: 'api_name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '显示顺序',
      dataIndex: 'display_order',
      key: 'display_order',
    },
    {
      title: '在特定设备不显示',
      dataIndex: 'hidden_devices',
      key: 'hidden_devices',
      render: (text, record) => {
        if (!record.hidden_devices || record.hidden_devices.length === 0) {
          return null;
        } else {
          return record.hidden_devices.map(x => <Tag key={`${record.id} + ${x}`}>{x}</Tag>);
        }
      },
    },
    {
      title: '相关的业务对象',
      dataIndex: 'object_describe_api_name',
      key: 'object_describe_api_name',
    },
    {
      title: '记录类型',
      dataIndex: 'record_type',
      key: 'record_type',
    },
    {
      title: '定义类型',
      dataIndex: 'define_type',
      key: 'define_type',
      render: (text) => {
        const defineType = text || 'custom';
        if (defineType == 'custom') {
          return <Tag color="green">{defineType}</Tag>;
        } else {
          return <Tag color="red">{defineType}</Tag>;
        }
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={editPage.bind(null, record)}>编辑</a>
          {_.get(record, 'define_type', 'custom') == 'custom' && <span className="ant-divider" />}
          {_.get(record, 'define_type', 'custom') == 'custom' && (
            <Popconfirm title="确认要删除菜单?" onConfirm={delPage.bind(null, record.id)}>
              <a>删除</a>
            </Popconfirm>
          )}
        </span>
      ),
    },
  ];
  return (
    <Row>
      <Row>
        <Col span="8">
          <Search
            placeholder="按菜单名称或ApiName模糊查询"
            style={{
              width: '210px',
              margin: '0 0 10px 0',
            }}
            onSearch={handleSearch}
          />
        </Col>
        <Col className={styles.mybutton}>
          <Button type="primary" onClick={handleLayout}>
            菜单布局
          </Button>
          <Button type="primary" onClick={handleAddData}>
            新建菜单
          </Button>
        </Col>
      </Row>

      <Table rowKey={record => record.id} columns={columns} pagination={false} dataSource={body} loading={loading} />
    </Row>
  );
};

function mapStateToProps(state) {
  const { body } = state.nav_tabs;
  return {
    body,
  };
}

export default connect(mapStateToProps)(TabList);
