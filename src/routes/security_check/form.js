import React from 'react';
import _ from 'lodash';
import { hashHistory } from 'dva/router';
import { Card, Row, Col, Tabs, Form, Popconfirm, Button, Tooltip } from 'antd';

import BasicForm from './BasicForm';
import AccountLoginForm from './AccountLoginForm';
import AccountLockForm from './AccountLockForm';
import PasswordChangeForm from './PasswordChangeForm';
import PasswordContentForm from './PasswordContentForm';
import PasswordExpireForm from './PasswordExpireForm';

import securityCheckTemplate from './securityCheckTemplate.json';

import styles from './styles.less';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;


const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const formTailLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16, offset: 4 },
};
class SecurityCheckForm extends React.Component {
  state = {
    activeKey: '0-3',
  };

  componentDidMount() {
  }

  onChange = (activeKey) => {
    this.setState({ activeKey });
  }
  onCancel = () => {
    hashHistory.push('/security_check/index');
  };
  resetFields=() => {
    const activeKeys = _.split(this.state.activeKey, '-');
    let restFieldList = _.slice(_.keys(securityCheckTemplate), activeKeys[0], activeKeys[1]);
    if (this.state.activeKey == '9-15') {
      restFieldList = _.concat(restFieldList, ['pwd_strong_check_require_charset_0', 'pwd_strong_check_require_charset_1']);
    }
    if (this.state.activeKey == '18-19') {
      _.forEach(['pc', 'app', 'ipad', 'wechat'], (type) => {
        restFieldList = _.concat(restFieldList, [
          `account_login_${type}_period_of_validity`, `account_login_${type}_allow_count`,
        ]);
      });
    }
    this.props.form.resetFields(restFieldList);
  }

  handleSubmit = (e) => {
    const { record, onOk } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const baseData = {};
        const securityCheckDefinitionData = {};

        if (!_.isEmpty(record)) {
          _.set(baseData, 'id', record.id);
          _.set(baseData, 'version', record.version);
        }
        // 处理BasicForm
        _.set(baseData, 'api_name', values.api_name);
        _.set(baseData, 'name', values.name);
        _.set(baseData, 'description', values.description);
        _.set(baseData, 'is_active', values.is_active);

        const securityCheckDefinitionRecord = JSON.parse(_.get(record, 'security_check_definition', '{}'));
        // 处理AccountLockForm
        _.set(securityCheckDefinitionData, 'pwd_failure_count_interval', _.toInteger(_.get(values, 'pwd_failure_count_interval', _.get(securityCheckDefinitionRecord, 'pwd_failure_count_interval', securityCheckTemplate.pwd_failure_count_interval))));
        _.set(securityCheckDefinitionData, 'pwd_lockout_duration', _.toInteger(_.get(values, 'pwd_lockout_duration', _.get(securityCheckDefinitionRecord, 'pwd_lockout_duration', securityCheckTemplate.pwd_lockout_duration))));
        _.set(securityCheckDefinitionData, 'pwd_max_failure', _.toInteger(_.get(values, 'pwd_max_failure', _.get(securityCheckDefinitionRecord, 'pwd_max_failure', securityCheckTemplate.pwd_max_failure))));

        // PasswordChangeForm
        _.set(securityCheckDefinitionData, 'pwd_lockout', _.get(values, 'pwd_lockout', _.get(securityCheckDefinitionRecord, 'pwd_lockout', securityCheckTemplate.pwd_lockout)));
        _.set(securityCheckDefinitionData, 'pwd_allow_user_change', _.get(values, 'pwd_allow_user_change', _.get(securityCheckDefinitionRecord, 'pwd_allow_user_change', securityCheckTemplate.pwd_allow_user_change)));
        _.set(securityCheckDefinitionData, 'pwd_safe_modify', _.get(values, 'pwd_safe_modify', _.get(securityCheckDefinitionRecord, 'pwd_safe_modify', securityCheckTemplate.pwd_safe_modify)));
        _.set(securityCheckDefinitionData, 'pwd_in_history', _.toInteger(_.get(values, 'pwd_in_history', _.get(securityCheckDefinitionRecord, 'pwd_in_history', securityCheckTemplate.pwd_in_history))));
        _.set(securityCheckDefinitionData, 'pwd_min_age', _.toInteger(_.get(values, 'pwd_min_age', _.get(securityCheckDefinitionRecord, 'pwd_min_age', securityCheckTemplate.pwd_min_age))));
        _.set(securityCheckDefinitionData, 'pwd_must_change', _.get(values, 'pwd_must_change', _.get(securityCheckDefinitionRecord, 'pwd_must_change', securityCheckTemplate.pwd_must_change)));


        // PasswordContentForm
        _.set(securityCheckDefinitionData, 'pwd_check_quality', _.toInteger(_.get(values, 'pwd_check_quality', _.get(securityCheckDefinitionRecord, 'pwd_check_quality', securityCheckTemplate.pwd_check_quality))));
        _.set(securityCheckDefinitionData, 'pwd_min_length', _.toInteger(_.get(values, 'pwd_min_length', _.get(securityCheckDefinitionRecord, 'pwd_min_length', securityCheckTemplate.pwd_min_length))));
        _.set(securityCheckDefinitionData, 'pwd_max_length', _.toInteger(_.get(values, 'pwd_max_length', _.get(securityCheckDefinitionRecord, 'pwd_max_length', securityCheckTemplate.pwd_max_length))));

        const pwd_strong_check_require_charset = [];
        const pwd_strong_check_require_charset_0 = _.get(values, 'pwd_strong_check_require_charset_0');
        const pwd_strong_check_require_charset_1 = _.get(values, 'pwd_strong_check_require_charset_1');
        if (!_.isEmpty(pwd_strong_check_require_charset_0)) {
          pwd_strong_check_require_charset[0] = _.join(pwd_strong_check_require_charset_0, '&&');
          if (_.toInteger(pwd_strong_check_require_charset_1) > 0) {
            pwd_strong_check_require_charset[1] = _.toInteger(pwd_strong_check_require_charset_1);
          }
        }
        if (!_.isEmpty(pwd_strong_check_require_charset)) {
          _.set(securityCheckDefinitionData, 'pwd_strong_check_require_charset', pwd_strong_check_require_charset);
        } else {
          _.set(securityCheckDefinitionData, 'pwd_strong_check_require_charset', _.get(securityCheckDefinitionRecord, 'pwd_strong_check_require_charset', securityCheckTemplate, pwd_strong_check_require_charset));
        }

        _.set(securityCheckDefinitionData, 'pwd_strong_check_lower_words', _.get(values, 'pwd_strong_check_lower_words', _.get(securityCheckDefinitionRecord, 'pwd_strong_check_lower_words', securityCheckTemplate.pwd_strong_check_lower_words)));
        _.set(securityCheckDefinitionData, 'pwd_strong_check_same_login_name', _.get(values, 'pwd_strong_check_same_login_name', _.get(securityCheckDefinitionRecord, 'pwd_strong_check_same_login_name', securityCheckTemplate.pwd_strong_check_same_login_name)));


        // PasswordExpireForm
        _.set(securityCheckDefinitionData, 'pwd_max_age', _.toInteger(_.get(values, 'pwd_max_age', _.get(securityCheckDefinitionRecord, 'pwd_max_age', securityCheckTemplate.pwd_max_age))));
        _.set(securityCheckDefinitionData, 'pwd_expire_warning', _.toInteger(_.get(values, 'pwd_expire_warning', _.get(securityCheckDefinitionRecord, 'pwd_expire_warning', securityCheckTemplate.pwd_expire_warning))));
        _.set(securityCheckDefinitionData, 'pwd_grace_auth_n_limit', _.toInteger(_.get(values, 'pwd_grace_auth_n_limit', _.get(securityCheckDefinitionRecord, 'pwd_grace_auth_n_limit', securityCheckTemplate.pwd_grace_auth_n_limit))));


        // AccountLoginForm
        _.set(securityCheckDefinitionData, 'account_login_allow_devices', _.get(values, 'account_login_allow_devices', _.get(securityCheckDefinitionRecord, 'account_login_allow_devices', securityCheckTemplate.account_login_allow_devices)));
        _.forEach(['pc', 'app', 'ipad', 'wechat'], (type) => {
          _.set(securityCheckDefinitionData, `account_login.${type}.period_of_validity`,
            _.toInteger(_.get(values, `account_login_${type}_period_of_validity`,
              _.get(securityCheckDefinitionRecord, `account_login.${type}.period_of_validity`, _.get(securityCheckTemplate, `account_login.${type}.period_of_validity`)))));

          _.set(securityCheckDefinitionData, `account_login.${type}.allow_count`,
            _.toInteger(_.get(values, `account_login_${type}_allow_count`,
              _.get(securityCheckDefinitionRecord, `account_login.${type}.allow_count`, _.get(securityCheckTemplate, `account_login.${type}.allow_count`)))));
        });

        console.log(securityCheckDefinitionData);
        onOk(baseData, securityCheckDefinitionData);
      }
    });
  }

  /**
   * //TODO 此处应该通过传入默认的securityCheckDefinitionRecord数据
   * @returns {*}
   */
  render() {
    const { dispatch, form, record } = this.props;
    const securityCheckDefinitionRecord = JSON.parse(_.get(record, 'security_check_definition', '{}'));
    const operations = (<div>
      <Popconfirm placement="topLeft" title="是否返回？" onConfirm={this.onCancel.bind(this)} okText="确定" cancelText="再想想">
        <Button>返回</Button>
      </Popconfirm>
      <Tooltip title="该重置按钮仅能重置当前标签页">
        <Button style={{ marginLeft: '5px' }} onClick={this.resetFields.bind(this)}>重置</Button>
      </Tooltip>
    </div>);
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card noHovering style={{ marginBottom: 24 }} loading={false} >
              <BasicForm form={form} record={record} />
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Tabs tabBarExtraContent={operations} activeKey={this.state.activeKey} onChange={this.onChange}>
              <TabPane tab="账户锁定策略" key="0-3">
                <AccountLockForm location={location} dispatch={dispatch} form={form} securityCheckDefinitionRecord={securityCheckDefinitionRecord} />
              </TabPane>
              <TabPane tab="密码更改策略" key="3-9">
                <PasswordChangeForm location={location} dispatch={dispatch} form={form} securityCheckDefinitionRecord={securityCheckDefinitionRecord} />
              </TabPane>
              <TabPane tab="密码内容策略" key="9-15">
                <PasswordContentForm location={location} dispatch={dispatch} form={form} securityCheckDefinitionRecord={securityCheckDefinitionRecord} />
              </TabPane>
              <TabPane tab="密码过期策略" key="15-18">
                <PasswordExpireForm location={location} dispatch={dispatch} form={form} securityCheckDefinitionRecord={securityCheckDefinitionRecord} />
              </TabPane>
              <TabPane tab="账户登录策略" key="18-19">
                <AccountLoginForm location={location} dispatch={dispatch} form={form} securityCheckDefinitionRecord={securityCheckDefinitionRecord} />
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </Form>
    );
  }
}


export default Form.create()(SecurityCheckForm);
