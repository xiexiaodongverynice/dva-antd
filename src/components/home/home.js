import React, { Component } from 'react';
import _ from 'lodash';
import { Card, Row, Col } from 'antd';
import * as userService from '../../services/user';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      enableNumber: '',
      allNumber: '',
    };
  }
  componentWillMount() {
    const payload = { pageNo: 1, pageSize: 10 };
    Promise.resolve(userService.fetch(payload))
      .then((data) => {
        const count = _.get(data, 'data.data.body.resultCount');
        this.setState({
          allNumber: count,
        });
      });
    const payloads = { enable: true, pageSize: 10 };
    Promise.resolve(userService.search(payloads))
      .then((data) => {
        const count = _.get(data, 'data.data.body.resultCount');
        this.setState({
          enableNumber: count,
        });
      });
  }

  render() {
    const { enableNumber, allNumber } = this.state;
    const card = { minHeight: 170, fontSize: '14px' };
    const adminUserInfo = JSON.parse(localStorage.getItem('adminUserInfo'));
    return (
      <div style={{ background: '#ECECEC', padding: '30px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="租户到期日期" bordered style={card}>
              <p>开始日期:{this.props.body.startDate}</p>
              <p>结束日期:{this.props.body.startDate}</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="账号使用情况" bordered={false} style={card}>
              <p>授权用户数: {allNumber}</p>
              <p>已激活用户数: {enableNumber}</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="租户信息" bordered={false} style={card}>
              <p>姓名: {_.get(adminUserInfo, 'name')}</p>
              <p>ID: {_.get(adminUserInfo, 'tenant_id')}</p>
              <p>登录账号: {_.get(adminUserInfo, 'account')}</p>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Home;
