import React from 'react';
import { connect } from 'dva';
import { hashHistory, routerRedux } from 'dva/router';
import { Table, Button, Pagination, Popconfirm, Input } from 'antd';
import styles from '../../styles/list.less';

const { Search } = Input;

const dutiesList = ({
                      body,
                      pageNo,
                      pageSize,
                      resultCount,
                      dispatch,
                    }) => {
  const onChange = (pagination, filter, sorter) => {
    const { order, field } = sorter;
    dispatch({
      type: 'dutiess/assignState',
      payload: {
        order,
        orderBy: field,
      },
    });
    dispatch({
      type: 'dutiess/fetch',
    });
  };

  const handleSearch = (name) => {
    dispatch({
      type: 'dutiess/assignState',
      payload: {
        name,
        pageNo: 1,
      },
    });
    dispatch({
      type: 'dutiess/fetch',
    });
  };

  // 跳转到添加页
  function handleAddData() {
    hashHistory.push('/duties/add');
  }

  // 翻页
  function indexPage(pageNo, pageSize) {
    dispatch({
      type: 'dutiess/assignState',
      payload: {
        pageNo,
        pageSize,
      },
    });
    dispatch({
      type: 'dutiess/fetch',
    });
  }

  // 跳转到编辑页
  function editPage(record) {
    const { id, name } = record;
    dispatch(routerRedux.push({
      pathname: '/duties/edit',
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
      type: 'dutiess/delduties',
      payload: {
        id,
      },
    });
  }

  // 分配
  function allotPage(record) {
    const { id, name } = record;
    dispatch(routerRedux.push({
      pathname: 'duties/distribution',
      query: {
        id,
        name,
        api_name: 'duty',
        indexName: '职务',
        fieldName: 'duty',
      },
      state: {
        parentName: name,
      },
    }));
  }

  const columns = [{
    title: '职务名',
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
        <Popconfirm title="确认要删除职务?" onConfirm={delPage.bind(null, record.id)}>
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
          placeholder="按职务名称模糊查询"
          style={{ width: '200px', margin: '0 0 10px 0' }}
          onSearch={handleSearch}
        />
        <div style={{ float: 'right' }}>
          <Button type="primary" onClick={handleAddData}>新建职务</Button>
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
  const { body, pageNo, pageSize, resultCount } = state.dutiess;
  return {
    loading: state.loading.models.dutiess,
    body,
    pageNo,
    pageSize,
    resultCount,
  };
}

export default connect(mapStateToProps)(dutiesList);
