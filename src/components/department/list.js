import React from 'react';
import { connect } from 'dva';
import { hashHistory, routerRedux } from 'dva/router';
import { Table, Button, Pagination, Popconfirm, Input } from 'antd';
import styles from '../../styles/list.less';

const { Search } = Input;

const departmentList = ({
                          body,
                          pageNo,
                          pageSize,
                          resultCount,
                          dispatch,
                        }) => {
  const onChange = (pagination, filter, sorter) => {
    const { order, field } = sorter;
    dispatch({
      type: 'departments/assignState',
      payload: {
        order,
        orderBy: field,
      },
    });
    dispatch({
      type: 'departments/fetch',
    });
  };
  // 跳转到添加页
  function handleAddData() {
    hashHistory.push('/department/add');
  }

  // 翻页
  function indexPage(pageNo, pageSize) {
    dispatch({
      type: 'departments/assignState',
      payload: {
        pageNo,
        pageSize,
      },
    });
    dispatch({
      type: 'departments/fetch',
    });
  }

  // 跳转到编辑页
  function editPage(record) {
    const { id, name } = record;
    dispatch(routerRedux.push({
      pathname: '/department/edit',
      query: {
        id,
      },
      state: {
        parentName: name,
      },
    }));
  }

  // 删除单条数据
  function delPage(id) {
    dispatch({
      type: 'departments/deldepartment',
      payload: {
        id,
      },
    });
  }

  // 分配
  function allotPage(record) {
    const { id, name } = record;
    dispatch(routerRedux.push({
      pathname: 'department/distribution',
      query: {
        id,
        name,
        api_name: 'department',
        indexName: '部门',
        fieldName: 'department',
      },
      state: {
        parentName: name,
      },
    }));
  }

  const handleSearch = (name) => {
    dispatch({
      type: 'departments/assignState',
      payload: {
        name,
        pageNo: 1,
      },
    });
    dispatch({
      type: 'departments/fetch',
    });
  };

  const columns = [{
    title: '部门名',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
  }, {
    title: 'API名称',
    dataIndex: 'api_name',
    key: 'api_name',
    sorter: true,
  }, {
    key: 'external_id',
    dataIndex: 'external_id',
    title: '外部ID',
    sorter: true,
  }, {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a onClick={editPage.bind(null, record)}>编辑</a>
        <span className="ant-divider" />
        <Popconfirm title="确认要删除部门?" onConfirm={delPage.bind(null, record.id)}>
          <a>删除</a>
        </Popconfirm>
        <span className="ant-divider" />
        <a onClick={allotPage.bind(null, record)}>分配</a>
      </span>
    ),
  }];
  return (
    <div>
      <div>
        <Search
          placeholder="按部门名称模糊查询"
          style={{ width: '200px', margin: '0 0 10px 0' }}
          onSearch={handleSearch}
        />
        <div style={{ float: 'right' }}>
          <Button type="primary" onClick={handleAddData}>新建部门</Button>
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
  const { body, pageNo, pageSize, resultCount } = state.departments;
  return {
    loading: state.loading.models.departments,
    body,
    pageNo,
    pageSize,
    resultCount,
  };
}

export default connect(mapStateToProps)(departmentList);
