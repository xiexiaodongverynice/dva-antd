import React, { Component } from 'react';
import { Table } from 'antd';
import { Link } from 'react-router';
import styles from './CustomObjectDetailLayoutList.css';

const Column = Table.Column;

const refresh = () => {
  setTimeout(() => {
    window.location.reload();
  }, 300);
};

export default class CustomObjectDetailLayoutList extends Component {

  render() {
    const ds = this.props.details.filter(item => item.layout_type === this.props.layoutType);
    return (
      <Table rowKey="id" className={styles.normal} dataSource={ds}>
        <Column
          title="布局名称"
          dataIndex="display_name"
          key="display_name"
        />
        <Column
          title="布局类型"
          dataIndex="layout_type"
          key="layout_type"
        />
        <Column
          title="操作"
          key="action"
          render={(text, record) => (
            <span>
              <Link to={`layouts/${this.props.object}/${record.layout_type}`}>
                <span className="nav-text" onClick={refresh}>修改</span>
              </Link>
              <span className="ant-divider" />
              <Link to={`layouts/${record.id}/delete`}>
                <span className="nav-text">删除</span>
              </Link>
            </span>
          )}
        />
      </Table>
    );
  }
}
