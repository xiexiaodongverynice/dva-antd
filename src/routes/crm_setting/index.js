import React from 'react';
import { Link } from 'dva/router';
import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Button, Input } from 'antd';
import styles from './index.css';

const TenantSettingIndex = ({ dispatch, body, loading }) => {
  const { items, size } = body;

  const deleteHandler = (id) => {
    console.log('deleteHandler', id);
  };

  const columns = [
    {
      title: 'API NAME',
      dataIndex: 'api_name',
      key: 'api_name',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        switch (type) {
          case 'app_home_config':
            return '移动端首页设置';
          case 'alert':
            return '通知模板';
          case 'print':
            return '打印模板';
          case 'calendar':
            return '日历模板';
          case 'workflow':
            return '工作流属性';
          case 'default_language':
            return '默认语言';
          case 'logo':
            return 'logo设置';
          default:
            return '';
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => (
        <span className={styles.operation}>
          <Link
            to={{
              pathname: `/crm_setting/edit?api_name=${record.api_name}`,
            }}
          >
            <span className="nav-text">编辑</span>
          </Link>
          <Popconfirm title="Confirm to delete?" onConfirm={deleteHandler.bind(this, record.id)}>
            <a href="">删除</a>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Button className={styles.create}>
        <Link
          to={{
            pathname: '/crm_setting/create',
          }}
        >
          <span>添加设置</span>
        </Link>
      </Button>
      <Table
        columns={columns}
        dataSource={items}
        loading={loading}
        rowKey="id"
        pagination={false}
        scroll={{ x: 800 }}
      />
    </div>
  );
};

function mapStateToProps(state) {
  const { body } = state.crm_setting;
  return {
    body,
    loading: state.loading.models.crm_setting,
  };
}

export default connect(mapStateToProps)(TenantSettingIndex);
