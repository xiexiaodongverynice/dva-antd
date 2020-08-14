/* eslint-disable react/sort-comp */
import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Row, Col, Button, Checkbox, Alert, Select, Input, message } from 'antd';
import * as Ssoservices from '../../services/sso';

const { Option } = Select;
class Authentication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedValues: ['forceclouds'],
      name: '',
      authid: '',
      version: '',
    };
  }

  componentWillMount() {
    this.query();
    this.authquery();
  }
  query = () => {
    Promise.resolve(Ssoservices.fetch()).then((data) => {
      const response = data.data.data.body.items;
      if (!_.isEmpty(response)) {
        _.each(response, (items, index) => {
          if (index === 0) {
            this.setState({
              name: items.name,
              id: items.id,
            });
          }
        });
      }
    });
  };
  authquery = () => {
    Promise.resolve(Ssoservices.authenquery()).then((data) => {
      const response = data.data.data.body;
      const checkedValues = [];
      if (!_.isEmpty(response)) {
        _.each(response.login_auth, (items) => {
          checkedValues.push(items.name);
        });
        this.setState({ checkedValues, domain: response.domain, authid: response.id, version: response.version });
      }
    });
  };
  onSave = () => {
    const { checkedValues, id, domain, authid, version } = this.state;
    const reg = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
    if (_.isEmpty(checkedValues)) {
      message.warning('请至少选择一项');
      return;
    }
    if (_.isEmpty(domain)) {
      message.warning('请输入域名');
      return;
    }
    if (!reg.test(domain)) {
      message.warning('请输入正确域名格式');
      return;
    }
    const login_auth = [];
    _.each(checkedValues, (items) => {
      if (items == 'forceclouds') {
        login_auth.push({ name: items, _id: 0, type: 0 });
      }
      if (items == 'saml2') {
        login_auth.push({ name: items, _id: id, type: 1 });
      }
    });
    if (authid == '') {
      const body = { api_name: 'login_auth', login_auth, domain };
      Promise.resolve(Ssoservices.authensave(body)).then((data) => {
        const head = data.data.data.head;
        if (_.get(head, 'code') == 200) {
          message.success('保存成功');
        }
      });
    } else {
      const body = { api_name: 'login_auth', login_auth, domain, version };
      Promise.resolve(Ssoservices.anuthupdate(body, authid)).then((data) => {
        const head = data.data.data.head;
        const body = data.data.data.body;
        if (_.get(head, 'code') == 200) {
          const version = _.get(body, 'version');
          this.setState({ version });
          message.success('保存成功');
        }
      });
    }
  };
  onChange = (checkedValues) => {
    this.setState({
      checkedValues,
    });
  };
  Changedomin = (event) => {
    if (event && event.target && event.target.value) {
      const value = event.target.value;
      this.setState(() => ({ domain: value }));
    } else {
      const value = '';
      this.setState(() => ({ domain: value }));
    }
  };
  render() {
    const { checkedValues, name, id, domain } = this.state;
    const plainOptions = [
      { label: 'forceclouds', value: 'forceclouds' },
      { label: '第三方认证', value: 'saml2', disabled: _.isEmpty(name) },
    ];
    return (
      <div>
        <Row>
          <Col span={4}>
            <span style={{ fontSize: '18px' }}>认证方式</span>
          </Col>
          {/* <Col span={6} pull={2}>
            <Alert message="请至少选择一项" type="warning" showIcon />
          </Col> */}
        </Row>
        <Row style={{ marginTop: '30px' }}>
          <Col span={5} push={1} style={{ marginTop: '5px' }}>
            <Checkbox.Group
              options={plainOptions}
              value={checkedValues}
              onChange={this.onChange}
              style={{ fontSize: '14px' }}
            />
          </Col>
          <Col span={4} push={1}>
            <Select style={{ width: 240 }} value={name} disabled={_.isEmpty(name)}>
              <Option value={id}>{name}</Option>
            </Select>
          </Col>
        </Row>
        <Row style={{ marginTop: '15px' }}>
          <Col span={1} push={1} style={{ marginTop: '5px' }}>
            域名:
          </Col>
          <Col span={4} push={1}>
            <Input placeholder="请输入域名" value={domain} onChange={(event) => this.Changedomin(event)} />
          </Col>
        </Row>
        <Row style={{ marginTop: '15px' }}>
          <Col span={4} push={1}>
            <Button className="ant-btn-primary" onClick={this.onSave}>
              {' '}
              保存{' '}
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect()(Authentication);
