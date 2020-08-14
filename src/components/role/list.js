import React from 'react';
import { connect } from 'dva';
import { hashHistory, routerRedux } from 'dva/router';
import { Table, Button, Pagination, Popconfirm, Input } from 'antd';
import { formatTimeFull } from '../../utils/date';
import styles from '../../styles/list.less';

const { Search } = Input;

function handleAddData() {
  hashHistory.push('/role/add');
}

const RoleList = ({
                    body,
                    pageNo,
                    pageSize,
                    resultCount,
                    dispatch,
                  }) => {
  const onChange = (pagination, filter, sorter) => {
    const { order, field } = sorter;
    dispatch({
      type: 'roles/assignState',
      payload: {
        order,
        orderBy: field,
      },
    });
    dispatch({
      type: 'roles/fetch',
    });
  };

  // 11/01/2018 - TAG: 模糊查询
  const handleSearch = (name) => {
    dispatch({
      type: 'roles/assignState',
      payload: {
        name,
        pageNo: 1,
      },
    });
    dispatch({
      type: 'roles/fetch',
    });
  };

  // 11/01/2018 - TAG: 翻页
  function indexPage(pageNo, pageSize) {
    dispatch({
      type: 'roles/fetch',
      payload: {
        pageNo,
        pageSize,
      },
    });
  }

  // 11/01/2018 - TAG: 跳转到编辑页或者查看页
  function openPage(record, pageType) {
    const { id, name: parentName } = record;
    dispatch(routerRedux.push({
      pathname: `/role/${pageType}`,
      query: {
        id,
      },
      state: {
        parentName,
      },
    }));
  }

  // 11/01/2018 - TAG: 删除操作
  function delPage(id) {
    dispatch({
      type: 'roles/delRole',
      payload: {
        id,
      },
    });
  }

  // 11/01/2018 - TAG: 角色分配
  function allotPage(record) {
    const { id, name: parentName } = record;
    dispatch(routerRedux.push({
      pathname: 'role/distribution',
      query: {
        id,
        name,
        api_name: 'role',
        indexName: '角色',
        fieldName: 'role',
      },
      state: {
        parentName,
      },
    }));
  }

  const columns = [{
    title: '角色名',
    key: 'name',
    sorter: true,
    render: (text, record) => (
      <a onClick={openPage.bind(null, record, 'detail')}>{record.name}</a>
    ),
  }, {
    title: 'API名称',
    dataIndex: 'api_name',
    key: 'api_name',
    sorter: true,
  }, {
    title: '数据权限',
    key: 'job',
    dataIndex: 'job',
    render: (job) => {
      if (job === 2) {
        return ('本岗');
      }
      if (job === 4) {
        return ('本岗及本岗下属');
      }
      if (job === 6) {
        return ('全部');
      }
    },
    sorter: true,
  }, {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    sorter: true,
    render: formatTimeFull,
  }, {
    title: '创建人',
    dataIndex: 'create_by__r.name',
    key: 'create_by__r.name',
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
        <a onClick={openPage.bind(null, record, 'edit')}>编辑</a>
        <span className="ant-divider" />
        <Popconfirm title="确认要删除角色?" onConfirm={delPage.bind(null, record.id)}>
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
          placeholder="按角色名称模糊查询"
          style={{ width: '200px', margin: '0 0 10px 0' }}
          onSearch={handleSearch}
        />
        <div style={{ float: 'right' }}>
          <Button type="primary" onClick={handleAddData}>新建角色</Button>
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
  const { body, pageNo, pageSize, resultCount } = state.roles;
  return {
    loading: state.loading.models.roles,
    body,
    pageNo,
    pageSize,
    resultCount,
  };
}

export default connect(mapStateToProps)(RoleList);
