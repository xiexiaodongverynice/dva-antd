/* eslint max-len: ['error', 150] */
import React, { Component } from 'react';
import dateFormat from 'dateformat';
import { Link } from 'react-router';
import { Table, Button, Checkbox } from 'antd';

const RelationField = ({ field }) => (
  <span> {field ? field.name : ''} </span>
);

class UserDetail extends Component {

  render() {
    const detail_container = { width: '100%', margin: '0 auto' };
    const detail_div = { width: '100px', margin: '10px auto', clear: 'both' };
    const detail_table = { width: '1000px', margin: '0 auto' };
    const detail_td_left = { width: '250px', textAlignLast: 'left', padding: '10px' };
    const detail_td_right = { width: '250px', textAlignLast: 'right', padding: '10px' };
    const detail_list = { width: '80%', margin: '10px auto' };
    const detail_h3 = { margin: '10px' };

    const logColumns = [{
      title: '登录时间',
      dataIndex: 'loginTime',
      key: 'loginTime',
      width: 150,
      render: (text, record) => {
        return (
          <span>{record.loginTime ? dateFormat(new Date(record.loginTime), 'yyyy-mm-dd HH:MM:ss') : ''}</span>
        );
      },
    }, {
      title: '登录IP',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 150,
    }, {
      title: '登录名称',
      dataIndex: 'loginName',
      key: 'loginName',
      width: 150,
    }, {
      title: '设备类型',
      dataIndex: 'deviceType',
      key: 'deviceType',
      width: 150,
    }, {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
      width: 150,
    }, {
      title: '系统版本号',
      dataIndex: 'osVersion',
      key: 'osVersion',
      width: 150,
    }, {
      title: '浏览器类型',
      dataIndex: 'browserType',
      key: 'browserType',
      width: 150,
    }, {
      title: '浏览器版本号',
      dataIndex: 'browserVersion',
      key: 'browserVersion',
      width: 150,
    }, {
      title: '状态',
      dataIndex: 'responseMsg',
      key: 'responseMsg',
      width: 150,
    }];
    const groupColumns = [{
      title: '操作',
      width: 200,
      render: (text, record) => {
        return (
          <div>
            <Link to={{ pathname: 'user/removeGroup', query: { id: record.user_permission_set, userId: this.props.body.id } }}>删除</Link>
          </div>
        );
      },
    }, {
      title: '权限组',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => {
        return (
          <Link to={{ pathname: 'group/privileges', query: { id: record.id, type: 'permission_set', state: 'see' } }}>
            {record.name}
          </Link>
        );
      },
    }, {
      title: '分配日期',
      dataIndex: 'update_time',
      key: 'update_time',
      render: (text, record) => {
        const dateTime = new Date(record.update_time);
        const dateText = dateFormat(dateTime, 'yyyy-mm-dd HH:MM:ss');
        return (
          <span>{dateText}</span>
        );
      },
    }];
    return (
      <div style={detail_container}>
        <h2>用户详细信息</h2>
        <div style={detail_div}>
          <Button type="primary">
            <Link to={{ pathname: 'user/register', query: { type: 'edit', id: this.props.body.id, version: this.props.body.version } }}>编辑</Link>
          </Button>
        </div>
        <table style={detail_table}>
          <tbody>
            <tr>
              <td style={detail_td_right}>用户编码</td>
              <td style={detail_td_left}>{this.props.body.id}</td>
              <td style={detail_td_right}>角色</td>
              <td style={detail_td_left}>
                <RelationField field={this.props.body.role__r} />
              </td>
            </tr>
            <tr>
              <td style={detail_td_right}>登录账号</td>
              <td style={detail_td_left}>{this.props.body.account}</td>
              <td style={detail_td_right}>简档</td>
              <td style={detail_td_left}>
                <RelationField field={this.props.body.profile__r} />
              </td>
            </tr>
            <tr>
              <td style={detail_td_right}>用户名</td>
              <td style={detail_td_left}>{this.props.body.name}</td>
              <td style={detail_td_right}>启用</td>
              <td style={detail_td_left}><Checkbox checked={this.props.body.enable} disabled /></td>
            </tr>
            <tr>
              <td style={detail_td_right}>电子邮件</td>
              <td style={detail_td_left}>{this.props.body.email}</td>
              <td style={detail_td_right}>电话</td>
              <td style={detail_td_left}>{this.props.body.phone}</td>
            </tr>
            <tr>
              <td style={detail_td_right}>性别</td>
              <td style={detail_td_left}>{this.props.body.gender}</td>
              <td style={detail_td_right}>分机</td>
              <td style={detail_td_left}>{this.props.body.extension}</td>
            </tr>
            <tr>
              <td style={detail_td_right}>职务</td>
              <td style={detail_td_left}>
                <RelationField field={this.props.body.duty__r} />
              </td>
              <td style={detail_td_right}>传真</td>
              <td style={detail_td_left}>{this.props.body.fax}</td>
            </tr>
            <tr>
              <td style={detail_td_right}>部门</td>
              <td style={detail_td_left}>
                <RelationField field={this.props.body.department__r} />
              </td>
              <td style={detail_td_right}>手机</td>
              <td style={detail_td_left}>{this.props.body.telephone}</td>
            </tr>
            <tr>
              <td style={detail_td_right}>员工编号</td>
              <td style={detail_td_left}>{this.props.body.employee_number}</td>
              <td style={detail_td_right}>创建人</td>
              <td style={detail_td_left}>
                <RelationField field={this.props.body.create_by__r} />
              </td>
            </tr>
            <tr>
              <td style={detail_td_right}>虚线上级</td>
              <td style={detail_td_left}>
                {this.props.body.dotted_line_manager__r ? this.props.body.dotted_line_manager__r.name : '-'}
              </td>
              <td style={detail_td_right}>修改人</td>
              <td style={detail_td_left}>
                <RelationField field={this.props.body.update_by__r} />
              </td>
            </tr>
            <tr>
              <td style={detail_td_right}>外部ID</td>
              <td style={detail_td_left}>
                {this.props.body.external_id}
              </td>
            </tr>
          </tbody>
        </table>
        <div style={detail_div}>
          <Button type="primary">
            <Link to={{ pathname: 'user/register', query: { type: 'edit', id: this.props.body.id, version: this.props.body.version } }}> 编辑 </Link>
          </Button>
        </div>
        <div>
          <div style={detail_list}>
            <h3 style={detail_h3}>权限组分配</h3>
            <Table rowKey="id" pagination={false} columns={groupColumns} dataSource={this.props.groupList} scroll={{ y: 100 }} />
          </div>
          <div style={detail_list}>
            <h3 style={detail_h3}>登录历史</h3>
            <Table rowKey={record => record.id} pagination={false} columns={logColumns} dataSource={this.props.logList} scroll={{ y: 100 }} />
          </div>
        </div>
      </div>
    );
  }
}

export default UserDetail;

