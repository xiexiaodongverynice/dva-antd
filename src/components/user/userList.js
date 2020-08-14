// 04/01/2018 - TAG: TODO 删除此组件，将所有内容移到routes中，因为model对于component毫无用处
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import _ from 'lodash';
import { Table, Button, Input, Checkbox, Pagination, Radio, message, Popconfirm } from 'antd';

import styles from '../../styles/list.less';
import { baseURL } from '../../utils/config';

const Search = Input.Search;
const RadioGroup = Radio.Group;
const user_list_link = { marginLeft: '5px' };
const list_btn = { margin: '10px 10px' };
const btn_div = { width: '400px', margin: '0 auto' };

function toNumber(params) {
  return params.map(item => parseInt(item, 10));
}

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: [],
      rows: [],
    };
  }

  onSelectChange = (rows, record) => {
    this.setState({
      rows,
      record,
    });
  }

  // 04/01/2018 - TAG: 排序变化
  onChange = (pagination, filter, sorter) => {
    const { dispatch } = this.props;
    const { order, field } = sorter;
    dispatch({
      type: 'user/assignState',
      payload: {
        order,
        orderBy: field,
      },
    });
    dispatch({
      type: 'user/fetch',
    });
  }

  // 重新密码
  handleRest = () => {
    this.props.dispatch({
      type: 'user/reset',
      payload: {
        user_infos: toNumber(this.state.rows),
      },
    });
  }
  // 批量激活
  handleActive = () => {
    const { rows } = this.state;
    this.props.dispatch({
      type: 'user/active',
      payload: {
        user_infos: toNumber(this.state.rows),
      },
    });
    if (!_.isEmpty(rows)) { // 批量激活后清空被选中记录
      rows.splice(0, rows.length);
    }
    this.setState();
  };
  // 检索
  handleSearch = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/assignState',
      payload: {
        pageNo: 1,
        name: value,
        nick_name: value,
      },
    });
    dispatch({
      type: 'user/fetch',
    });
  }
  // 激活radio
  handleChange = (e) => {
    const { target: { value } } = e;
    const { dispatch } = this.props;
    let enable;
    if (value === '1') {
      enable = true;
    } else if (value === '2') {
      enable = false;
    } else {
      enable = null;
    }
    dispatch({
      type: 'user/assignState',
      payload: {
        enable,
        pageNo: 1,
      },
    });
    dispatch({
      type: 'user/fetch',
    });
  }
  // 文件上传之前
  beforeUpload = (file) => {
    const fileType = file.name.substring(file.name.indexOf('.') + 1);
    const isCSV = fileType === 'csv';
    if (!isCSV) {
      message.error('亲，请使用CSV文件导入！');
    }
    return isCSV;
  }
  handleDownload = () => {
    setTimeout(() => {
      message.success('用户导出!');
    }, 2000);
  }

  // 04/01/2018 - TAG: 分页及页数变化
  indexPage = (pageNo, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/assignState',
      payload: {
        pageNo,
        pageSize,
      },
    });
    dispatch({
      type: 'user/fetch',
    });
  }

  delUser = (id) => {
    this.props.dispatch({
      type: 'user/deleteUser',
      payload: {
        id,
      },
    });
  }

  render() {
    const { rows } = this.state;
    const rowSelection = {
      selectedRowKeys: rows,
      onChange: this.onSelectChange,
    };
    const columns = [{
      title: '昵称',
      dataIndex: 'nick_name',
      key: 'nick_name',
      sorter: true,
      render: (text, record) => {
        return (
          <div>
            <Link
              to={{
                pathname: '/user/detail',
                query: {
                  type: 'search',
                  id: record.id,
                  version: record.version,
                },
                state: {
                  parentName: record.name,
                },
              }}
            >{record.nick_name}</Link>
          </div>
        );
      },
    }, {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text, record) => {
        return (
          <div>
            <Link
              to={{
                pathname: '/user/detail',
                query: {
                  type: 'search',
                  id: record.id,
                  version: record.version,
                },
                state: {
                  parentName: record.name,
                },
              }}
            >{record.name}</Link>
          </div>
        );
      },
    }, {
      title: '角色',
      key: 'role',
      render: (text, record) => {
        return (
          <div>
            {record.role__r === undefined
              ? record.role
              : <Link
                to={{
                  pathname: '/role/detail',
                  query: {
                    id: record.role__r.id,
                    name: record.role__r.name,
                    api_name: 'role',
                    indexName: '角色',
                    fieldName: 'rol_id',
                  },
                  state: {
                    parentName: record.role__r.name,
                  },
                }}
              >{record.role__r.name}</Link>
            }
          </div>
        );
      },
    }, {
      title: '激活',
      dataIndex: 'enable',
      key: 'enable',
      sorter: true,
      render: (text, record) => {
        return (
          <div>
            <Checkbox checked={record.enable} disabled />
          </div>
        );
      },
    }, {
      title: '简档',
      key: 'profile',
      render: (text, record) => {
        return (
          <div>
            {record.profile__r === undefined
              ? record.profile
              : <Link
                to={{
                  pathname: '/profile/privileges',
                  query: {
                    id: record.profile__r.id,
                  },
                  state: {
                    parentName: record.profile__r.name,
                  },
                }}
              >{record.profile__r.name}</Link>
            }
          </div>
        );
      },
    }, {
      title: '部门',
      key: 'department',
      render: (text, record) => _.chain(record).result('department__r').result('name', '').value(),
    }, {
      title: '登录账号',
      dataIndex: 'account',
      key: 'account',
      sorter: true,
      render: (text, record) => {
        return (
          <div>
            <Link
              to={{
                pathname: '/user/detail',
                query: {
                  type: 'search',
                  id: record.id,
                  version: record.version,
                },
                state: {
                  parentName: record.name,
                },
              }}
              style={user_list_link}
            >
              {record.account}
            </Link>
          </div>
        );
      },
    }, {
      key: 'external_id',
      dataIndex: 'external_id',
      title: '外部ID',
      sorter: true,
    }, {
      title: '操作',
      render: (text, record) => {
        return (
          <div>
            <Link
              to={{
                pathname: '/user/register',
                query: {
                  type: 'edit',
                  id: record.id,
                  version: record.version,
                },
                state: {
                  parentName: record.name,
                },
              }}
              style={user_list_link}
            >
              编辑
            </Link>
            <Link
              to={{
                pathname: '/user/detail',
                query: {
                  id: record.id,
                  version: record.version,
                },
                state: {
                  parentName: record.name,
                },
              }}
              style={user_list_link}
            >
              查看
            </Link>
            <Popconfirm title="确认要删除用户?" onConfirm={this.delUser.bind(this, record.id)}>
              &nbsp;<a>删除</a>
            </Popconfirm>
          </div>
        );
      },
    }];

    // const uploadUrl = 'http://10.0.0.140:8080/rest/upload/user_info';
    const token = localStorage.getItem('token');
    // 上传属性设置
    // eslint-disable-next-line no-unused-vars
    const uploadProps = {
      name: 'file',
      action: `${baseURL}/rest/upload/user_info`,
      headers: {
        token,
      },
      onChange(info) {
        const head = _.get(info, 'file.response.head');
        const code = _.get(head, 'code');
        if (code === 200) {
          message.success('亲，用户导入成功！');
        } else {
          message.error(`亲，用户导入失败！=>${_.get(head, 'msg')}`);
        }
      },
    };
    // 下载设置
    // eslint-disable-next-line no-unused-vars
    const downloadUrl = `${baseURL}/rest/download/user_info?token=${token}`;
    // const downloadUrl = `http://10.0.0.140:8080/rest/download/user_info?token=${token}`;
    return (
      <div style={{ width: '100%' }}>
        <Search
          placeholder="按用户名和昵称模糊查询"
          style={{
            width: '200px',
            margin: '0 0 10px 0',
          }}
          onSearch={this.handleSearch}
        />
        <RadioGroup onChange={this.handleChange} style={{ marginLeft: '20px' }}>
          <Radio value="0">全部</Radio>
          <Radio value="1">激活</Radio>
          <Radio value="2">未激活</Radio>
        </RadioGroup>
        <div>
          <div style={btn_div}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <Link to={{ pathname: '/user/register', query: { type: 'add' } }}>
                      <Button type="primary" style={list_btn}>新用户</Button>
                    </Link>
                  </td>
                  <td>
                    <Button onClick={this.handleRest} type="primary" style={list_btn}>重置密码</Button>
                  </td>
                  {
                    /**
                     *  <td>
                          <Upload {...uploadProps} beforeUpload={this.beforeUpload} showUploadList={false}>
                            <Button type="primary">导入</Button>
                          </Upload>
                        </td>
                        <td>
                          <a href={downloadUrl}>
                            <Button type="primary" onClick={this.handleDownload} style={list_btn}>导出</Button>
                          </a>
                        </td>
                     */
                  }
                  <td><Button onClick={this.handleActive} type="primary" style={list_btn}>批量激活</Button></td>
                </tr>
              </tbody>
            </table>
          </div>

          <Table
            pagination={false}
            rowKey={record => record.id}
            rowSelection={rowSelection}
            dataSource={this.props.body.result}
            columns={columns}
            onChange={this.onChange}
          />

          <div className={styles.PaginationBox}>
            <Pagination
              showSizeChanger
              total={this.props.body.resultCount}
              showTotal={total => `共 ${total} 条`}
              pageSize={this.props.body.pageSize}
              current={this.props.body.pageNo}
              onChange={this.indexPage}
              onShowSizeChange={this.indexPage}
              className={styles.myPagination}
            />
          </div>
        </div>
      </div>
    );
  }
}

UserList.proTypes = {
  onSearch: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  user: PropTypes.array.isRequired,
};

export default UserList;
