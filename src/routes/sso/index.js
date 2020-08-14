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
class Sso extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }
  state = { visible: false, isEdit: false, ssoList: [], islook: false, isdelete: false };
  componentDidMount() {
    this.query();
    this.authquery();
  }
  query = () => {
    Promise.resolve(Ssoservices.fetch()).then((data) => {
      const response = data.data.data.body.items;
      this.setState({
        ssoList: response,
      });
    });
  };
  authquery = () => {
    Promise.resolve(Ssoservices.authenquery()).then((data) => {
      const response = data.data.data.body;
      if (!_.isEmpty(response)) {
        _.each(response.login_auth, (items) => {
          if (items.name == 'saml2') {
            this.setState({
              isdelete: true,
            });
          }
        });
      }
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
    const { isdelete } = this.state;
    if (isdelete) {
      message.warning('该数据已添加认证方式中,无法删除');
      return;
    }
    Promise.resolve(Ssoservices.deleteQuery(item)).then((data) => {
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
        if (values.unique_domain == 'nameId') {
          values.unique_domain = { key: 'nameId', value: 'email' };
        }
        if (values.unique_domain == 'attributeId') {
          values.unique_domain = { key: 'attributeId', value: 'email' };
        }
        if (!isEdit) {
          Promise.resolve(Ssoservices.newconstruction(values)).then((data) => {
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
          Promise.resolve(Ssoservices.update(values)).then((data) => {
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
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'api_name',
        dataIndex: 'api_name',
        key: 'api_name',
      },
      {
        title: '信任地址',
        dataIndex: 'sp_entity_id',
        key: 'sp_entity_id',
      },
      {
        title: '认证地址',
        dataIndex: 'idp_entity_id',
        key: 'idp_entity_id',
      },
      {
        title: '解密证书',
        dataIndex: 'sp_decode_cert',
        key: 'sp_decode_cert',
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
            <span>单点登录设置</span>
          </Col>
          <Col span={12} style={{ textAlign: 'right', marginBottom: '5px' }}>
            <Button onClick={this.setNewQuery} type="primary" disabled={!_.isEmpty(ssoList)}>
              添加单点登录
            </Button>
            <Modal
              className="params_set_modal"
              title={isEdit ? '编辑单点登录设置' : '新建单点登录设置'}
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
                <FormItem {...formItemLayout} label="名称" hasFeedback>
                  {getFieldDecorator('name', {
                    initialValue: _.get(initValue, 'name', ''),
                    rules: [{ required: true, message: '请输入名称!', whitespace: true }],
                  })(<Input placeholder="单行输入" disabled={islook} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="api_name" hasFeedback>
                  {getFieldDecorator('api_name', {
                    initialValue: _.get(initValue, 'api_name', ''),
                    rules: [{ required: true, message: '请输入API_NAME!', whitespace: true }],
                  })(<Input placeholder="单行输入" disabled={islook} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="颁发人" hasFeedback>
                  {getFieldDecorator('issuer', {
                    initialValue: _.get(initValue, 'issuer', ''),
                    rules: [{ required: true, message: '请输入颁发人!', whitespace: true }],
                  })(<Input placeholder="单行输入" disabled={islook} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="请求签名方法" hasFeedback>
                  {getFieldDecorator('signature_algorithm', {
                    initialValue: _.get(initValue, 'signature_algorithm', ''),
                    rules: [{ required: false }],
                  })(
                    <Select size="default" style={{ width: '100%' }} disabled={islook}>
                      <Option value="RSA-SHA1">RSA-SHA1</Option>
                      <Option value="RSA-SHA256">RSA-SHA256</Option>
                    </Select>,
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="解密证书" hasFeedback>
                  {getFieldDecorator('sp_decode_cert', {
                    initialValue: _.get(initValue, 'sp_decode_cert', ''),
                    rules: [{ required: true, message: '请选择解密证书!' }],
                  })(
                    <Select size="default" style={{ width: '100%' }} disabled={islook}>
                      <Option value="不使用证书">不使用证书</Option>
                      <Option value="使用自签名证书">使用自签名证书</Option>
                    </Select>,
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="唯一标识域" hasFeedback>
                  {getFieldDecorator('unique_domain', {
                    initialValue: _.get(initValue, 'unique_domain.key', ''),
                    rules: [{ required: true, message: '请选择唯一标识域!' }],
                  })(
                    <Select size="default" style={{ width: '100%' }} disabled={islook}>
                      <Option value="attributeId">Atrribute域</Option>
                      <Option value="nameId">默认NameID域</Option>
                    </Select>,
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="登出方式" hasFeedback>
                  {getFieldDecorator('logout_method', {
                    initialValue: _.get(initValue, 'logout_method', ''),
                    rules: [{ required: true, message: '请选择登出方式!' }],
                  })(
                    <Select size="default" style={{ width: '100%' }} disabled={islook}>
                      <Option value="服务提供商本地登出">服务提供商本地登出</Option>
                      <Option value="身份提供商全局登出">身份提供商全局登出</Option>
                    </Select>,
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="SAML版本" hasFeedback>
                  {getFieldDecorator('saml_version', {
                    initialValue: '2.0',
                    rules: [{ required: false }],
                  })(
                    <Select size="default" style={{ width: '100%' }} disabled>
                      <Option value="2.0">2.0</Option>
                    </Select>,
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="域名" hasFeedback>
                  {getFieldDecorator('domain', {
                    initialValue: _.get(initValue, 'domain', ''),
                    rules: [
                      { required: true, message: '请输入域名!', whitespace: true },
                      { pattern: new RegExp(reg), message: '请输入正确域名格式' },
                    ],
                  })(<Input disabled={islook} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="信任地址" hasFeedback>
                  {getFieldDecorator('sp_entity_id', {
                    initialValue: _.get(initValue, 'sp_entity_id', ''),
                    rules: [
                      { required: true, message: '请输入信任地址!', whitespace: true },
                      { pattern: new RegExp(http), message: '请输入正确网址格式' },
                    ],
                  })(<Input disabled={islook} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="认证地址" hasFeedback>
                  {getFieldDecorator('idp_entity_id', {
                    initialValue: _.get(initValue, 'idp_entity_id', ''),
                    rules: [
                      { required: true, message: '请输入认证地址!', whitespace: true },
                      { pattern: new RegExp(http), message: '请输入正确网址格式' },
                    ],
                  })(<Input disabled={islook} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="身份提供商证书" hasFeedback>
                  {getFieldDecorator('idp_cert', {
                    initialValue: _.get(initValue, 'idp_cert', ''),
                    rules: [{ required: true, message: '请输入证书信息!', whitespace: true }],
                  })(<Input type="textarea" rows={4} disabled={islook} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="身份提供商登录URL" hasFeedback>
                  {getFieldDecorator('idp_login_url', {
                    initialValue: _.get(initValue, 'idp_login_url', ''),
                    rules: [
                      { required: true, message: '请输入URL!', whitespace: true },
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
export default Form.create()(Sso);
