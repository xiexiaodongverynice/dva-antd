/**
 * Created by Administrator on 2017/5/16 0016.
 */
import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Table, Pagination, Popconfirm, Button, Input } from 'antd';
import { Link } from 'react-router';
import styles from './CustomObjectList.css';
import CustomFieldModal from './CustomFieldModal';
import SetFieldDependencyModal from './SetFieldDependencyModal';

const Search = Input.Search;
const dateFormat = require('dateformat');

function CustomFieldList({ dispatch, body, loading, objId, routerQuery }) {
  const pageChange = (pageNo, pageSize) => {
    dispatch({
      type: 'customFields/fetch',
      payload: {
        pageNo,
        pageSize,
        objId,
      },
    });
  };

  function deleteHandler(id) {
    console.warn(`TODO: ${id}`);
    dispatch({
      type: 'customFields/remove',
      payload: { objId, id },
    });
  }

  function editHandler(id, values) {
    dispatch({
      type: 'customFields/put',
      payload: { objId, id, values },
    });
  }

  function viewHandler(id, values) {
    console.log(values);
  }

  function createHandler(values) {
    dispatch({
      type: 'customFields/create',
      payload: { objId, values },
    });
  }

  const handleSearch = (label) => {
    dispatch({
      type: 'customFields/updateState',
      payload: {
        pageNo: 1,
        pageSize: 10,
        label,
      },
    });
    dispatch({
      type: 'customFields/fetch',
    });
  };

  const adminUserInfo = JSON.parse(localStorage.getItem('adminUserInfo'));
  const selectTypes = ['select_one', 'select_many'];
  const renderOperationCol = (text, record) => {
    if (selectTypes.includes(record.type)) {
      return (
        <span className={styles.operation}>
          <CustomFieldModal record={record} viewState="view" onOk={viewHandler.bind(null, record.id)}>
            <a>查看</a>
          </CustomFieldModal>
          <CustomFieldModal
            record={record}
            routerQuery={routerQuery}
            viewState="edit"
            dispatch={dispatch}
            onOk={editHandler.bind(null, record.id)}
          >
            <a>编辑</a>
          </CustomFieldModal>
          <SetFieldDependencyModal
            record={record}
            routerQuery={routerQuery}
            viewState="edit"
            dispatch={dispatch}
            onOk={editHandler.bind(null, record.id)}
          >
            <a>设置依赖</a>
          </SetFieldDependencyModal>
          <Popconfirm title="Confirm to delete?" onConfirm={deleteHandler.bind(null, record.id)}>
            <a href="">删除</a>
          </Popconfirm>
        </span>
      );
    } else {
      return (
        <span className={styles.operation}>
          <CustomFieldModal
            record={record}
            routerQuery={routerQuery}
            viewState="view"
            onOk={viewHandler.bind(null, record.id)}
          >
            <a>查看</a>
          </CustomFieldModal>
          <CustomFieldModal
            record={record}
            routerQuery={routerQuery}
            viewState="edit"
            dispatch={dispatch}
            onOk={editHandler.bind(null, record.id)}
          >
            <a>编辑</a>
          </CustomFieldModal>
          <Popconfirm title="Confirm to delete?" onConfirm={deleteHandler.bind(null, record.id)}>
            <a href="">删除</a>
          </Popconfirm>
        </span>
      );
    }
  };
  const columns = [
    {
      title: '字段名称',
      dataIndex: 'label',
      key: 'display_name',
      width: 150,
      render: (text, record) => (
        <span className={styles.operation}>
          <CustomFieldModal record={record} viewState="view" onOk={viewHandler.bind(null, record.id)}>
            <a>{text}</a>
          </CustomFieldModal>
        </span>
      ),
    },
    {
      title: 'API名称',
      dataIndex: 'api_name',
      key: 'api_name',
      width: 150,
    },

    {
      title: '是否唯一',
      dataIndex: 'is_unique',
      key: 'is_unique',
      width: 80,
      render: text => <span>{text ? '是' : '否'}</span>,
    },
    {
      title: '字段类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
    },

    {
      title: '列类型',
      dataIndex: 'column_type',
      key: 'column_type',
      width: 80,
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
      title: '是否必填',
      dataIndex: 'is_required',
      key: 'is_required',
      render: text => <span>{text ? '是' : '否'}</span>,
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
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 100,
    },

    {
      title: '创建人',
      dataIndex: 'create_by',
      key: 'create_by',
      width: 80,
      render: (id) => {
        const name = id === _.toString(adminUserInfo.id) ? _.get(adminUserInfo, 'name') : id;
        return name;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: 80,
      render: (text) => {
        return dateFormat(text, 'yyyy-mm-dd HH:MM:ss');
      },
    },

    {
      title: '操作字段',
      key: 'operation',
      width: 180,
      render: renderOperationCol,
    },
  ];

  return (
    <div className={styles.normal}>
      <div>
        <div className={styles.create}>
          <Search placeholder="按字段名称模糊查询" style={{ width: '200px', float: 'left' }} onSearch={handleSearch} />
          <CustomFieldModal
            record={{}}
            routerQuery={routerQuery}
            key={Math.random(0, 10)}
            viewState="add"
            onOk={createHandler}
          >
            <Button type="primary">创建一个新的字段</Button>
          </CustomFieldModal>
          <Link to={'/customObjects'} style={{ marginLeft: 10 }}>
            <Button type="default" className="margin-right">
              返回
            </Button>
          </Link>
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
  const { body, objId } = state.customFields;

  return {
    body,
    objId,
    loading: state.loading.models.customFields,
    routerQuery: _.get(state, 'routing.locationBeforeTransitions.query', {}),
  };
}

export default connect(mapStateToProps)(CustomFieldList);
