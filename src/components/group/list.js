import React from 'react';
import { connect } from 'dva';
import { hashHistory, routerRedux } from 'dva/router';
import { Table, Button, Pagination, Popconfirm, Input } from 'antd';
import styles from '../../styles/list.less';

const { Search } = Input;

const GroupList = ({
                     body,
                     pageNo,
                     pageSize,
                     resultCount,
                     dispatch,
                   }) => {
  const onChange = (pagination, filter, sorter) => {
    const { order, field } = sorter;
    dispatch({
      type: 'groups/assignState',
      payload: {
        order,
        orderBy: field,
      },
    });
    dispatch({
      type: 'groups/fetch',
    });
  };

  // 跳转添加页
  function handleAddData() {
    hashHistory.push('/group/add');
  }

  // 翻页
  function indexPage(pageNo, pageSize) {
    dispatch({
      type: 'groups/assignState',
      payload: {
        pageNo,
        pageSize,
      },
    });
    dispatch({
      type: 'groups/fetch',
    });
  }

  // 跳转修改页
  function editPage(record) {
    dispatch(routerRedux.push({
      pathname: '/group/copy',
      query: record,
      state: {
        parentName: record.name,
      },
    }));
  }

  // 删除单条数据
  function delPage(id) {
    dispatch({
      type: 'groups/delGroup',
      payload: {
        id,
      },
    });
  }

  // 分配
  function allotPage(record) {
    dispatch(routerRedux.push({
      pathname: 'group/distribution',
      query: {
        id: record.id,
        name: record.name,
        api_name: 'permission_set',
        indexName: '权限组',
        fieldName: 'permission_set',
        group: true,
      },
      state: {
        parentName: record.name,
      },
    }));
  }

  function group_add(record, state) {
    const url = 'group/privileges';
    dispatch(routerRedux.push({
      pathname: url,
      query: {
        id: record.id,
        type: 'permission_set',
        state,
      },
      state: {
        parentName: record.name,
      },
    }));
  }

  const handleSearch = (name) => {
    dispatch({
      type: 'groups/assignState',
      payload: {
        name,
        pageNo: 1,
      },
    });
    dispatch({
      type: 'groups/fetch',
    });
  };

  const columns = [
    {
      title: '权限组名称',
      key: 'name',
      sorter: true,
      render: (text, record) => (
        <a onClick={group_add.bind(null, record, 'see')}>{record.name}</a>
      ),
    },
    {
      title: 'API名称',
      key: 'api_name',
      dataIndex: 'api_name',
      sorter: true,
    },
    {
      title: '描述',
      dataIndex: 'describe',
      key: 'describe',
      sorter: true,
    }, {
      key: 'external_id',
      dataIndex: 'external_id',
      title: '外部ID',
      sorter: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <Popconfirm title="确认要删除该权限组?" onConfirm={delPage.bind(null, record.id)}>
            <a>删除</a>
          </Popconfirm>
          <span className="ant-divider" />
          <a onClick={group_add.bind(null, record, 'edit')}>设置权限</a>
          {
            /*
            <span className="ant-divider" />
          <a onClick={editPage.bind(null, record)}>复制</a>
            */
          }
          <span className="ant-divider" />
          <a onClick={allotPage.bind(null, record)}>分配</a>
        </span>
    ),
    },
  ];
  return (
    <div>
      <div>
        <Search
          placeholder="按角色名称模糊查询"
          style={{ width: '200px', margin: '0 0 10px 0' }}
          onSearch={handleSearch}
        />
        <div style={{ float: 'right' }}>
          <Button type="primary" onClick={handleAddData}>新建</Button>
        </div>
      </div>
      <Table
        rowKey={record => record.id} columns={columns}
        pagination={false}
        dataSource={body.result}
        onChange={onChange}
      />
      <div className={styles.PaginationBox}>
        <Pagination
          showSizeChanger
          total={resultCount}
          showTotal={total => `共 ${total} 条`}
          pageSize={pageSize}
          current={pageNo}
          onChange={indexPage}
          onShowSizeChange={indexPage}
          className={styles.myPagination}
        />
      </div>
    </div>
  );
};


function mapStateToProps(state) {
  const { body, pageNo, pageSize, resultCount } = state.groups;
  return {
    loading: state.loading.models.groups,
    body,
    pageNo,
    pageSize,
    resultCount,
  };
}

export default connect(mapStateToProps)(GroupList);
