/**
 * Created by Administrator on 2017/5/16 0016.
 */
import React from 'react';
import { Link } from 'dva/router';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Button, Input, Menu, Dropdown, Icon } from 'antd';
import styles from './CustomObjectList.css';
import CustomObjectModal from './CustomObjectModal';

const Search = Input.Search;
const dateFormat = require('dateformat');

function CustomObjectList({ dispatch, body, loading }) {
  function deleteHandler(id) {
    dispatch({
      type: 'customObjects/remove',
      payload: id,
    });
  }

  function enableApprovalHandler(id) {
    console.log('enableApprovalHandler');
    dispatch({
      type: 'customObjects/enableApprovalFlow',
      payload: { id },
    });
  }

  const pageChange = (pageNo, pageSize) => {
    dispatch({
      type: 'customObjects/fetch',
      payload: {
        pageNo,
        pageSize,
      },
    });
  };

  function editHandler(id, values) {
    dispatch({
      type: 'customObjects/put',
      payload: {
        id,
        values,
      },
    });
  }

  function viewHandler(id, values) {
    console.log(values);
  }

  function createHandler(values) {
    dispatch({
      type: 'customObjects/create',
      payload: values,
    });
  }

  const handleSearch = (display_name) => {
    dispatch({
      type: 'customObjects/updateState',
      payload: {
        pageNo: 1,
        pageSize: 10,
        display_name,
      },
    });
    dispatch({
      type: 'customObjects/fetch',
    });
  };

  const columns = [
    {
      title: '对象名称',
      dataIndex: 'display_name',
      key: 'display_name',
      width: 100,
      render: (text, record) => (
        <span className={styles.operation}>
          <CustomObjectModal record={record} viewState="view" onOk={viewHandler.bind(null, record.id)}>
            <a>{text}</a>
          </CustomObjectModal>
        </span>
      ),
    },
    {
      title: 'API名称',
      dataIndex: 'api_name',
      key: 'api_name',
      width: 100,
    },
    /*
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
    },*/

    {
      title: '表名',
      dataIndex: 'table_name',
      key: 'table_name',
      width: 100,
    },
    {
      title: '包',
      dataIndex: 'package',
      key: 'package',
      width: 80,
    },
    {
      title: '定义类型',
      dataIndex: 'define_type',
      key: 'define_type',
      width: 80,
    },
    {
      title: '是否启用',
      dataIndex: 'is_active',
      key: 'is_active',
      render: text => <span>{text ? '是' : '否'}</span>,
      width: 80,
    },
    {
      title: 'name是否唯一',
      dataIndex: 'is_name_unique',
      key: 'is_name_unique',
      render: text => <span>{text ? '是' : '否'}</span>,
      width: 100,
    },
    {
      title: '是否删除',
      dataIndex: 'is_deleted',
      key: 'is_deleted',
      render: text => <span>{text ? '是' : '否'}</span>,
      width: 80,
    },
    // {
    //   title: '描述',
    //   dataIndex: 'description',
    //   key: 'description',
    //   width: 100,
    // },
    // {
    //   title: '租户ID',
    //   dataIndex: 'tenant_id',
    //   key: 'tenant_id',
    // },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (text) => {
        return dateFormat(text, 'yyyy-mm-dd HH:MM:ss');
      },
      width: 150,
    },
    {
      title: '操作',
      key: 'operation',
      width: 160,
      render: (text, record) => {
        const enableApprovalMenu =
          record.enable_approval_flow || record.package === 'crm_approval' ? null : (
            <Menu.Item>
              <Popconfirm title="确定在该对象上启用审批流?" onConfirm={enableApprovalHandler.bind(null, record.id)}>
                <a href="">启用审批流</a>
              </Popconfirm>
            </Menu.Item>
          );

        const menu = (
          <Menu>
            <Menu.Item>
              <Popconfirm title="Confirm to delete?" onConfirm={deleteHandler.bind(null, record.id)}>
                <a href="">删除</a>
              </Popconfirm>
            </Menu.Item>
            {enableApprovalMenu}
            <Menu.Item>
              <Link
                to={{
                  pathname: `customObjects/${record.api_name}/actions`,
                  state: {
                    parentName: record.display_name,
                  },
                }}
              >
                <span className="nav-text">Custom Actions</span>
              </Link>
            </Menu.Item>
          </Menu>
        );
        return (
          <span className={styles.operation}>
            <CustomObjectModal record={record} viewState="view" onOk={viewHandler.bind(null, record.id)}>
              <a>详情</a>
            </CustomObjectModal>
            <CustomObjectModal record={record} viewState="edit" onOk={editHandler.bind(null, record.id)}>
              <a>编辑</a>
            </CustomObjectModal>
            <Link
              to={{
                pathname: `customObjects/${record.id}/fields`,
                state: {
                  parentName: record.display_name,
                },
                query: { objectApiName: record.api_name },
              }}
            >
              <span className="nav-text">字段集</span>
            </Link>
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link" href="javascript:void(0)">
                <Icon type="menu-unfold" />
              </a>
            </Dropdown>
          </span>
        );
      },
    },
  ];

  return (
    <div className={styles.normal}>
      <div>
        <div className={styles.create}>
          <Search placeholder="按对象名称模糊查询" style={{ width: '200px', float: 'left' }} onSearch={handleSearch} />
          <CustomObjectModal record={{}} viewState="add" key={Math.random(0, 10)} onOk={createHandler} mode="new">
            <Button type="primary">创建一个新的对象</Button>
          </CustomObjectModal>
        </div>
        <Table
          columns={columns}
          dataSource={body.result}
          loading={loading}
          rowKey="id"
          pagination={false}
          scroll={{ x: 800 }}
        />
        <Pagination
          className="ant-table-pagination"
          showSizeChanger
          total={body.resultCount}
          showTotal={total => `共 ${total} 条`}
          pageSize={body.pageSize}
          current={body.pageNo}
          onChange={pageChange}
          onShowSizeChange={pageChange}
        />
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  const { body } = state.customObjects;
  return {
    body,
    loading: state.loading.models.customObjects,
  };
}

export default connect(mapStateToProps)(CustomObjectList);
