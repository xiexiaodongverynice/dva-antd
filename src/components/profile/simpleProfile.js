import React, { Component } from 'react';
import { Link } from 'react-router';
import { Table, Button, Input, Pagination, Popconfirm } from 'antd';
import { formatTimeFull } from '../../utils/date';
import styles from '../../styles/list.less';

const Search = Input.Search;

const profile_link = { marginLeft: '5px' };
const edit_btn = { marginRight: 10 };

// 09/01/2018 - TAG: 简档
class SimpleProfile extends Component {

  onChange = (pagination, filter, sorter) => {
    const { dispatch } = this.props;
    const { order, field } = sorter;
    dispatch({
      type: 'profile/assignState',
      payload: {
        order,
        orderBy: field,
      },
    });
    dispatch({
      type: 'profile/fetch',
    });
  }

  // 09/01/2018 - TAG: 查询
  handleSearch = (name) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'profile/assignState',
      payload: {
        name,
        pageNo: 1,
      },
    });
    dispatch({
      type: 'profile/search',
    });
  };

  // 09/01/2018 - TAG: 删除
  handleDelete = (id) => {
    this.props.dispatch({
      type: 'profile/deleteProfile',
      payload: {
        id,
      },
    });
  };

  // 09/01/2018 - TAG: 刷新
  handleRefresh = () => {
    this.props.dispatch({
      type: 'profile/fetch',
    });
  };

  indexPage = (pageNo, pageSize) => {
    this.props.dispatch({
      type: 'profile/fetch',
      payload: {
        pageNo,
        pageSize,
      },
    });
  };

  render() {
    const { body } = this.props;

    const columns = [{
      title: '简档名',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      sorter: true,
      render: (text, record) => {
        return (
          <Link
            to={{
              pathname: '/profile/privileges',
              query: {
                viewType: 'true',
                type: 'profile',
                id: record.id,
              },
              state: {
                parentName: record.name,
              },
            }}
          >{record.name}</Link>
        );
      },
    }, {
      title: 'API_NAME',
      dataIndex: 'api_name',
      key: 'api_name',
      width: 150,
      sorter: true,
    }, {
      title: '是否超级管理员',
      dataIndex: 'is_super_profile',
      key: 'is_super_profile',
      width: 150,
      sorter: true,
      render: (text, record) => {
        return record.is_super_profile ? '是' : '否';
      },
    }, {
      title: '创建人',
      dataIndex: 'create_by__r.name',
      key: 'create_by__r.name',
      width: 150,
      sorter: true,
    }, {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: 150,
      render: formatTimeFull,
      sorter: true,
    }, {
      title: '最后操作人',
      dataIndex: 'update_by__r.name',
      key: 'update_by__r.name',
      width: 150,
      sorter: true,
    }, {
      title: '最后操作时间',
      dataIndex: 'update_time',
      key: 'update_time',
      width: 150,
      render: formatTimeFull,
      sorter: true,
    }, {
      key: 'external_id',
      dataIndex: 'external_id',
      title: '外部ID',
      sorter: true,
      width: 100,
    }, {
      title: '操作',
      key: 'operation',
      dataIndex: 'operation',
      width: 200,
      render: (text, record) => {
        return (
          <div>
            <Link
              to={{
                pathname: '/profile/privileges',
                query: {
                  type: 'profile',
                  id: record.id,
                },
                state: {
                  parentName: record.name,
                },
              }}
              style={profile_link}
            >
              设置权限
            </Link>
            <Link
              to={{
                pathname: '/profile/editProfile',
                query: {
                  type: 'copy',
                  id: record.id,
                  name: record.name,
                },
                state: {
                  parentName: record.name,
                },
              }}
              style={profile_link}
            >
              复制
            </Link>
            <Popconfirm id={record.id} title="确认要删除简档?" onConfirm={this.handleDelete.bind(null, record.id)}>
              <a id={record.id} style={profile_link}>删除</a>
            </Popconfirm>
            <Link
              to={{
                pathname: 'profile/distribution',
                query: {
                  id: record.id,
                  name: record.name,
                  api_name: 'profile',
                  indexName: '简档',
                  fieldName: 'profile',
                },
                state: {
                  parentName: record.name,
                },
              }}
              style={profile_link}
            >分配</Link>
          </div>
        );
      },
    }];
    return (
      <div>
        <div>
          <Search
            placeholder="按简档名模糊查询"
            style={{ width: '200px', margin: '0 0 10px 0' }}
            onSearch={this.handleSearch}
          />
          <div style={{ float: 'right' }}>
            <Link to={{ pathname: '/profile/editProfile', query: { type: 'add' } }}>
              <Button type="primary" style={edit_btn}>新建简档</Button>
            </Link>
            <Button type="primary" icon="sync" style={edit_btn} onClick={this.handleRefresh} />
          </div>
        </div>
        <Table
          pagination={false} style={{ width: '100%' }}
          rowKey={record => record.id}
          dataSource={body.result}
          columns={columns}
          onChange={this.onChange}
        />
        <div className={styles.PaginationBox}>
          <Pagination
            showSizeChanger
            total={body.resultCount}
            showTotal={total => `共 ${total} 条`}
            pageSize={body.pageSize}
            current={body.pageNo}
            onChange={this.indexPage}
            onShowSizeChange={this.indexPage}
            className={styles.myPagination}
          />
        </div>
      </div>
    );
  }
}

export default SimpleProfile;
