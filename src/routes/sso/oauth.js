/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { Button, Row, Col, Form, Select, Input, Table, Popconfirm, Modal, message } from 'antd';
import * as Ssoservices from '../../services/sso';
import _ from 'lodash';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};
class Oauth extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }
  state = { visible: false, isEdit: false, ssoList: [], islook: false, isdelete: false };
  componentDidMount() {
    this.query();
  }
  query = () => {
    Promise.resolve(Ssoservices.oauthfetch()).then((data) => {
      const response = data.data.data.body.items;
      this.setState({
        ssoList: response,
      });
    });
  };
  setNewQuery = () => {
    this.setState({
      visible: true,
      isEdit: false,
      initValue: [],
      islook: false,
    });
  };
  editQuery = (item) => {
    this.setState({
      visible: true,
      isEdit: true,
      initValue: item,
      islook: false,
    });
  };
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };
  deleteQuery = (item) => {
    if (item.is_delete) {
      message.warning('该数据已添加认证方式中,无法删除');
      return;
    }
    Promise.resolve(Ssoservices.oauthdeleteQuery(item)).then((data) => {
      const head = data.data.data.head;
      if (_.get(head, 'code') == 200) {
        message.success('删除成功');
        this.query();
      }
    });
  };
  lookQuery = (item) => {
    this.setState({
      visible: true,
      isEdit: true,
      initValue: item,
      islook: true,
    });
  };
  handleOk = (e) => {
    const { isEdit, initValue } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (!isEdit) {
          values.api_name = 'oauth_config';
          Promise.resolve(Ssoservices.oauthnewconstruction(values)).then((data) => {
            const head = data.data.data.head;
            if (_.get(head, 'code') == 200) {
              message.success('新建成功');
              this.setState(
                {
                  visible: false,
                },
                () => {
                  this.query();
                },
              );
            }
          });
        } else {
          values.id = _.get(initValue, 'id', '');
          values.version = _.get(initValue, 'version', '');
          Promise.resolve(Ssoservices.oauthupdate(values)).then((data) => {
            const head = data.data.data.head;
            if (_.get(head, 'code') == 200) {
              message.success('修改成功');
              this.setState(
                {
                  visible: false,
                },
                () => {
                  this.query();
                },
              );
            }
          });
        }
        this.props.form.resetFields();
      }
    });
  };
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { ssoList, isEdit, visible, initValue, islook } = this.state;
    const reg = '^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$';
    const http = '^([hH][tT]{2}[pP]://|[hH][tT]{2}[pP][sS]://)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~/])+$';
    const url =
      '^(?=^.{3,255}$)(http(s)?://)?(www.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:d+)*(/w+.w+)*([?&]w+=w*)*$';
    const columns = [
      {
        title: '域名',
        dataIndex: 'domain',
        key: 'domain',
      },
      {
        title: '登录url',
        dataIndex: 'idp_login_url',
        key: 'idp_login_url',
      },
      {
        title: '登出url',
        dataIndex: 'idp_logout_url',
        key: 'idp_logout_url',
      },
      {
        title: '回调地址',
        dataIndex: 'idp_callback_url',
        key: 'idp_callback_url',
      },
      {
        title: '服务器唯一客户标识',
        dataIndex: 'client_id',
        key: 'client_id',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          const { mode } = this.props;
          return (
            <span>
              <a
                href="JavaScript:;"
                style={{ color: mode === 'detail' ? 'rgba(0, 0, 0, 0.25)' : '' }}
                onClick={() => this.lookQuery(record)}
              >
                查看
              </a>
              &nbsp;&nbsp;
              <a
                href="JavaScript:;"
                style={{ color: mode === 'detail' ? 'rgba(0, 0, 0, 0.25)' : '' }}
                onClick={() => this.editQuery(record)}
              >
                编辑
              </a>
              &nbsp;&nbsp;
              <Popconfirm
                placement="topLeft"
                title={'确认删除？    '}
                onConfirm={() => this.deleteQuery(record)}
                okText="确认"
                cancelText="取消"
              >
                <a href="JavaScript:;">删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];
    return (
      <div>
        <Row>
          <Col span={12}>
            <span>oauth集成配置管理</span>
          </Col>
          <Col span={12} style={{ textAlign: 'right', marginBottom: '5px' }}>
            <Button onClick={this.setNewQuery} type="primary">
              新建
            </Button>
            <Modal
              className="params_set_modal"
              title={isEdit ? '编辑oauth集成配置管理' : '新建oauth集成配置管理'}
              visible={visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={[
                <Button key="submit" htmlType="submit" type="primary" onClick={this.handleOk} disabled={islook}>
                  提交
                </Button>,
                <Button key="back" onClick={this.handleCancel}>
                  返回
                </Button>,
              ]}
            >
              <Form>
                <FormItem {...formItemLayout} label="域名" hasFeedback>
                  {getFieldDecorator('domain', {
                    initialValue: _.get(initValue, 'domain', ''),
                    rules: [
                      { required: true, message: '请输入域名!', whitespace: true },
                      { pattern: new RegExp(reg), message: '请输入正确域名格式' },
                    ],
                  })(<Input disabled={islook} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="登录url" hasFeedback>
                  {getFieldDecorator('idp_login_url', {
                    initialValue: _.get(initValue, 'idp_login_url', ''),
                    rules: [
                      { required: true, message: '请输入登录url!', whitespace: true },
                      { pattern: new RegExp(http), message: '请输入正确网址格式' },
                    ],
                  })(<Input disabled={islook} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="登出url" hasFeedback>
                  {getFieldDecorator('idp_logout_url', {
                    initialValue: _.get(initValue, 'idp_logout_url', ''),
                    rules: [
                      { required: true, message: '请输入登出url!', whitespace: true },
                      { pattern: new RegExp(http), message: '请输入正确网址格式' },
                    ],
                  })(<Input disabled={islook} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="回调地址" hasFeedback>
                  {getFieldDecorator('idp_callback_url', {
                    initialValue: _.get(initValue, 'idp_callback_url', ''),
                    rules: [
                      { required: true, message: '请输入回调地址!', whitespace: true },
                      { pattern: new RegExp(http), message: '请输入正确网址格式' },
                    ],
                  })(<Input disabled={islook} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="服务器客户标识" hasFeedback>
                  {getFieldDecorator('client_id', {
                    initialValue: _.get(initValue, 'client_id', ''),
                    rules: [{ required: true, message: '请输入服务器客户标识!', whitespace: true }],
                  })(<Input disabled={islook} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="服务器客户标识密码" hasFeedback>
                  {getFieldDecorator('client_secret', {
                    initialValue: _.get(initValue, 'client_secret', ''),
                    rules: [{ required: true, message: '请输入服务器客户标识密码!', whitespace: true }],
                  })(<Input placeholder="单行输入" disabled={islook} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="服务器客户码" hasFeedback>
                  {getFieldDecorator('oauth_consumer_key', {
                    initialValue: _.get(initValue, 'oauth_consumer_key', ''),
                    rules: [{ required: true, message: '请输入服务器客户码!', whitespace: true }],
                  })(<Input disabled={islook} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="重定向接收地址" hasFeedback>
                  {getFieldDecorator('ticket_url_prefix', {
                    initialValue: _.get(initValue, 'ticket_url_prefix', ''),
                    rules: [
                      { required: true, message: '请输入重定向接收地址!', whitespace: true },
                      { pattern: new RegExp(url), message: '请输入正确URL格式' },
                    ],
                  })(<Input disabled={islook} />)}
                </FormItem>
              </Form>
            </Modal>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table columns={columns} dataSource={ssoList} />
          </Col>
        </Row>
      </div>
    );
  }
}
export default Form.create()(Oauth);
