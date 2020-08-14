import React from 'react';
import { connect } from 'dva';
import { Link } from 'react-router';
import _ from 'lodash';
import { Table, Popconfirm, Pagination, Input } from 'antd';
import styles from './list.less';

const Search = Input.Search;

const trigger_list = ({ dispatch, body = { result: [] }, loading }) => {
  // 切换分页
  const pageChange = (pageNo, pageSize) => {
    dispatch({
      type: 'trigger/pageChange',
      payload: {
        pageNo,
        pageSize,
      } });
  };

  // 删除触发器
  const delPage = (id) => {
    dispatch({
      type: 'trigger/del_transfer',
      payload: {
        id,
      },
    });
  };

  // 开启触发器
  const open = (id, runnigState) => {
    dispatch({
      type: 'trigger/open_transfer',
      payload: {
        openObj: {
          id,
          state: runnigState,
        },
      },
    });
  };

  const deleteBtn = (trigger) => {
    if (trigger) {
      return (
        <Popconfirm title="确认要删除触发器?" onConfirm={delPage.bind(null, trigger.id)}>
          <a>删除</a>
        </Popconfirm>
      );
    } else {
      return null;
    }
  };

  const handleSearch = (object_describe_display_name) => {
    dispatch({
      type: 'trigger/search',
      payload: {
        object_describe_display_name,
      },
    });
  };


  const adminUserInfo = JSON.parse(localStorage.getItem('adminUserInfo'));

  // 列定义
  const columns = [{
    title: '所属对象',
    dataIndex: 'display_name',
    key: 'display_name',
    width: 100,
    render: (value, row) => {         // 数据中已经包含了合并列
      return {
        children: value,
        props: {
          rowSpan: row.rowSpan,
        },
      };
    },
  }, {
    title: '名称',
    dataIndex: 'trigger.name',
    key: 'trigger.name',
    width: 200,
  }, {
    title: 'API版本',
    dataIndex: 'trigger.api_version',
    key: 'trigger.api_version',
    width: 100,
  }, {
    title: '脚本说明',
    dataIndex: 'trigger.describe',
    key: 'trigger.describe',
  }, {
    title: '修改人',
    dataIndex: 'trigger.update_by',
    key: 'trigger.update_by',
    width: 100,
    render: (id) => {
      const name = id === _.toString(adminUserInfo.id) ? _.get(adminUserInfo, 'name') : id;
      return name;
    },
  }, {
    title: '触发器操作',
    key: 'action',
    width: 200,
    render: (text, record) => {
      const trigger = _.result(record, 'trigger');
      if (trigger) {
        const btns = [
          <Link to={{ pathname: `trigger/${record.id}/editor`, search: `?id=${trigger.id}`, state: { parentName: record.trigger.name } }}>
            <span className="nav-text">编辑</span>
          </Link>,
          <span className="ant-divider" />,
          deleteBtn(trigger),
          <span className="ant-divider" />,
        ];
        if (trigger.is_active) {
          return (
            <span>
              {btns}
              <Popconfirm title="确认要关闭触发器?" onConfirm={open.bind(null, trigger.id, false)}>
                <a>关闭</a>
              </Popconfirm>
            </span>
          );
        } else {
          return (
            <span>
              {btns}
              <Popconfirm title="确认要开启触发器?" onConfirm={open.bind(null, trigger.id, true)}>
                <a>开启</a>
              </Popconfirm>
            </span>
          );
        }
      } else {
        return null;
      }
    },
  }, {
    title: '对象操作',
    key: 'action1',
    width: 100,
    render: (value, record) => {         // 数据中已经包含了合并列
      return {
        children: (
          <Link
            to={{
              pathname: `trigger/${record.id}/editor`,
              search: `?api_name=${record.api_name}`,
              state: { parentName: record.display_name },
            }}
          >
            <span className="nav-text">新建触发器</span>
          </Link>
        ),
        props: {
          rowSpan: record.rowSpan,
        },
      };
    },
  }];

  return (
    <div className={styles.normal}>
      <Search
        placeholder="按所属对象名模糊查询"
        style={{ width: '200px', margin: '0 0 10px 0' }}
        onSearch={handleSearch}
      />
      <Table
        columns={columns}
        dataSource={body.result}
        loading={loading}
        pagination={false}
        scroll={{ x: 800 }}
        rowKey="uid"
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
  );
};

function mapStateToProps(state) {
  const { triggerOne, body } = state.trigger;
  return {
    triggerOne,
    body,
    loading: state.loading.models.trigger,
  };
}

export default connect(mapStateToProps)(trigger_list);
