import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Form, Icon, Tooltip, Select, Checkbox, Row, Col, Collapse } from 'antd';
import securityCheckAnnotation from './securityCheckAnnotation.json';
import securityCheckTemplate from './securityCheckTemplate.json';
import { durationMinuteTime } from '../../utils/index';

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;


const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

/**
 * 账户登录安全策略
 */
class AccountLoginForm extends React.Component {
  state = {
    options: {
    },
    duration: {},
    collapseActiveKey: _.concat(['account_login_allow_devices'], _.get(this.props.securityCheckDefinitionRecord, 'account_login_allow_devices', securityCheckTemplate.account_login_allow_devices)),
    collapseDisabledMap: _.remove(securityCheckTemplate.account_login_allow_devices, _.get(this.props.securityCheckDefinitionRecord, 'account_login_allow_devices', securityCheckTemplate.account_login_allow_devices)),
  };

  componentDidMount() {
  }


  // 根据用户选择的可用设备，折叠并禁用
  onAccountLoginAllowDevicesChange=(checkedValues) => {
    const collapseActiveKey = _.concat(['account_login_allow_devices'], checkedValues);
    const collapseDisabledMap = [];// _.difference(securityCheckTemplate.account_login_allow_devices, checkedValues);

    this.setState({ collapseActiveKey, collapseDisabledMap });
  }


  // 输入一个值，动态改变下拉框内容选项
  handleChange = (type, DVS = [], value) => {
    const { options } = this.state;
    let option;
    if (!value || DVS.includes(value)) {
      option = [];
    } else {
      option = <Option key={value}>{value}</Option>;
    }
    _.set(options, type, option);
    this.setState({ options });
  }

  // 转换时间格式，展示用
  handleDurationTime=(field) => {
    const { duration } = this.state;
    const { getFieldValue } = this.props.form;
    const fieldValue = _.toNumber(getFieldValue(field));

    const dt = durationMinuteTime(fieldValue);

    _.set(duration, `${field}_duration`, dt);
    this.setState({ duration });
  }

  callback=(key) => {
    console.log(key);
    this.setState({ collapseActiveKey: key });
  }


  render() {
    const { form: { getFieldDecorator }, securityCheckDefinitionRecord } = this.props;
    return (
      <Collapse bordered={false} defaultActiveKey={['account_login_allow_devices']} activeKey={this.state.collapseActiveKey} onChange={this.callback.bind(this)}>
        <Panel header="用户可访问设备" key="account_login_allow_devices" disabled>
          {/* 用户可访问设备*/}
          <FormItem
            {...formItemLayout} label={(
              <span>
              &nbsp;
                <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.account_login_allow_devices }} />}>
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
          >
            {getFieldDecorator('account_login_allow_devices', {
              initialValue: _.get(securityCheckDefinitionRecord, 'account_login_allow_devices', securityCheckTemplate.account_login_allow_devices),
              rules: [{
                required: true,
                message: '请选择用户可访问设备',
              },
                  // { validator: this.validatePSCRC1 }
              ],
            })(
              <Checkbox.Group onChange={this.onAccountLoginAllowDevicesChange.bind(this)}>
                <Row>
                  <Col span={6}><Checkbox value="pc">PC</Checkbox></Col>
                  <Col span={6}><Checkbox value="app">App</Checkbox></Col>
                  <Col span={6}><Checkbox value="ipad">iPad</Checkbox></Col>
                  <Col span={6}><Checkbox value="wechat">WeChat</Checkbox></Col>
                </Row>
              </Checkbox.Group>,
              )}
          </FormItem>
        </Panel>

        <Panel header="PC" key="pc" disabled={_.includes(this.state.collapseDisabledMap, 'pc')}>
          <FormItem
            {...formItemLayout} label={(
              <span>
              登录有效期(分)&nbsp;
                <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.account_login_pc_period_of_validity }} />}>
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
          >
            {getFieldDecorator('account_login_pc_period_of_validity', {
              initialValue: _.get(securityCheckDefinitionRecord, 'account_login.pc.period_of_validity', securityCheckTemplate.account_login.pc.period_of_validity).toString(),
              rules: [{
                required: true,
                message: '请选择或者输入PC登录有效期，仅限数字',
                type: 'integer',
                transform: value => _.toNumber(value),
              }],
            })(
              <Select
                allowClear
                mode="combobox"
                style={{ width: 200 }}
                onChange={this.handleChange.bind(this, 'account_login_pc_period_of_validity', [securityCheckTemplate.account_login.pc.period_of_validity.toString()])}
                onBlur={this.handleDurationTime.bind(this, 'account_login_pc_period_of_validity')}
                filterOption={false}
                placeholder="请选择"
                optionLabelProp="children"
              >
                <Option key="10080">默认，7天（10080分钟）</Option>
                {this.state.options.account_login_pc_period_of_validity}
              </Select>,
              )}
            <span style={{ paddingLeft: 5 }} >{this.state.duration.account_login_pc_period_of_validity_duration}</span>
          </FormItem>
          <FormItem
            {...formItemLayout} label={(
              <span>
              有效登录设备数量&nbsp;
                <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.account_login_pc_allow_count }} />}>
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
          >
            {getFieldDecorator('account_login_pc_allow_count', {
              initialValue: _.get(securityCheckDefinitionRecord, 'account_login.pc.allow_count', securityCheckTemplate.account_login.pc.allow_count).toString(),
              rules: [{
                required: true,
                message: '请选择或者输入PC有效登录设备数量，仅限数字',
                type: 'integer',
                transform: value => _.toNumber(value),
              }],
            })(
              <Select
                  // allowClear
                  // mode="combobox"
                style={{ width: 200 }}
                onChange={this.handleChange.bind(this, 'account_login_pc_allow_count', [securityCheckTemplate.account_login.pc.allow_count.toString()])}
                  // onBlur={this.handleDurationTime.bind(this, 'account_login_pc_allow_count')}
                  // filterOption={false}
                placeholder="请选择"
              >
                <Option key="-1">默认，不限制</Option>
                <Option key="1">1</Option>
                <Option key="2">2</Option>
                <Option key="3">3</Option>
                {/* {this.state.options.account_login_pc_allow_count}*/}
              </Select>,
              )}
          </FormItem>
        </Panel>

        <Panel header="App" key="app" disabled={_.includes(this.state.collapseDisabledMap, 'app')}>
          <FormItem
            {...formItemLayout} label={(
              <span>
              登录有效期(分)&nbsp;
                <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.account_login_app_period_of_validity }} />}>
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
          >
            {getFieldDecorator('account_login_app_period_of_validity', {
              initialValue: _.get(securityCheckDefinitionRecord, 'account_login.app.period_of_validity', securityCheckTemplate.account_login.app.period_of_validity).toString(),
              rules: [{
                required: true,
                message: '请选择或者输入PC登录有效期，仅限数字',
                type: 'integer',
                transform: value => _.toNumber(value),
              }],
            })(
              <Select
                allowClear
                mode="combobox"
                style={{ width: 200 }}
                onChange={this.handleChange.bind(this, 'account_login_app_period_of_validity', [securityCheckTemplate.account_login.app.period_of_validity.toString()])}
                onBlur={this.handleDurationTime.bind(this, 'account_login_app_period_of_validity')}
                filterOption={false}
                placeholder="请选择"
                optionLabelProp="children"
              >
                <Option key="10">默认，10分钟</Option>
                {this.state.options.account_login_app_period_of_validity}
              </Select>,
              )}
            <span style={{ paddingLeft: 5 }} >{this.state.duration.account_login_app_period_of_validity_duration}</span>
          </FormItem>

          <FormItem
            {...formItemLayout} label={(
              <span>
              有效登录设备数量&nbsp;
                <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.account_login_app_allow_count }} />}>
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
          >
            {getFieldDecorator('account_login_app_allow_count', {
              initialValue: _.get(securityCheckDefinitionRecord, 'account_login.app.allow_count', securityCheckTemplate.account_login.app.allow_count).toString(),
              rules: [{
                required: true,
                message: '请选择或者输入App有效登录设备数量，仅限数字',
                type: 'integer',
                transform: value => _.toNumber(value),
              }],
            })(
              <Select
                  // allowClear
                  // mode="combobox"
                style={{ width: 200 }}
                onChange={this.handleChange.bind(this, 'account_login_app_allow_count', [securityCheckTemplate.account_login.app.allow_count.toString()])}
                  // onBlur={this.handleDurationTime.bind(this, 'account_login_app_allow_count')}
                  // filterOption={false}
                placeholder="请选择"
              >
                <Option key="-1">默认，不限制</Option>
                <Option key="1">1</Option>
                <Option key="2">2</Option>
                <Option key="3">3</Option>
                {/* {this.state.options.account_login_app_allow_count}*/}
              </Select>,
              )}
          </FormItem>

        </Panel>
        <Panel header="Ipad" key="ipad" disabled={_.includes(this.state.collapseDisabledMap, 'ipad')}>
          <FormItem
            {...formItemLayout} label={(
              <span>
              登录有效期(分)&nbsp;
                <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.account_login_ipad_period_of_validity }} />}>
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
          >
            {getFieldDecorator('account_login_ipad_period_of_validity', {
              initialValue: _.get(securityCheckDefinitionRecord, 'account_login.ipad.period_of_validity', securityCheckTemplate.account_login.ipad.period_of_validity).toString(),
              rules: [{
                required: true,
                message: '请选择或者输入PC登录有效期，仅限数字',
                type: 'integer',
                transform: value => _.toNumber(value),
              }],
            })(
              <Select
                allowClear
                mode="combobox"
                style={{ width: 200 }}
                onChange={this.handleChange.bind(this, 'account_login_ipad_period_of_validity', [securityCheckTemplate.account_login.ipad.period_of_validity.toString()])}
                onBlur={this.handleDurationTime.bind(this, 'account_login_ipad_period_of_validity')}
                filterOption={false}
                placeholder="请选择"
                optionLabelProp="children"
              >
                <Option key="10">默认，10分钟</Option>
                {this.state.options.account_login_ipad_period_of_validity}
              </Select>,
              )}
            <span style={{ paddingLeft: 5 }} >{this.state.duration.account_login_ipad_period_of_validity_duration}</span>
          </FormItem>

          <FormItem
            {...formItemLayout} label={(
              <span>
              有效登录设备数量&nbsp;
                <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.account_login_ipad_allow_count }} />}>
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
          >
            {getFieldDecorator('account_login_ipad_allow_count', {
              initialValue: _.get(securityCheckDefinitionRecord, 'account_login.ipad.allow_count', securityCheckTemplate.account_login.ipad.allow_count).toString(),
              rules: [{
                required: true,
                message: '请选择或者输入Ipad有效登录设备数量，仅限数字',
                type: 'integer',
                transform: value => _.toNumber(value),
              }],
            })(
              <Select
                  // allowClear
                  // mode="combobox"
                style={{ width: 200 }}
                onChange={this.handleChange.bind(this, 'account_login_ipad_allow_count', [securityCheckTemplate.account_login.ipad.allow_count.toString()])}
                  // onBlur={this.handleDurationTime.bind(this, 'account_login_ipad_allow_count')}
                  // filterOption={false}
                placeholder="请选择"
              >
                <Option key="-1">默认，不限制</Option>
                <Option key="1">1</Option>
                <Option key="2">2</Option>
                <Option key="3">3</Option>
                {/* {this.state.options.account_login_ipad_allow_count}*/}
              </Select>,
              )}
          </FormItem>

        </Panel>
        <Panel header="Wechat" key="wechat" disabled={_.includes(this.state.collapseDisabledMap, 'wechat')}>
          <FormItem
            {...formItemLayout} label={(
              <span>
              登录有效期(分)&nbsp;
                <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.account_login_wechat_period_of_validity }} />}>
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
          >
            {getFieldDecorator('account_login_wechat_period_of_validity', {
              initialValue: _.get(securityCheckDefinitionRecord, 'account_login.wechat.period_of_validity', securityCheckTemplate.account_login.wechat.period_of_validity).toString(),
              rules: [{
                required: true,
                message: '请选择或者输入PC登录有效期，仅限数字',
                type: 'integer',
                transform: value => _.toNumber(value),
              }],
            })(
              <Select
                allowClear
                mode="combobox"
                style={{ width: 200 }}
                onChange={this.handleChange.bind(this, 'account_login_wechat_period_of_validity', [securityCheckTemplate.account_login.wechat.period_of_validity.toString()])}
                onBlur={this.handleDurationTime.bind(this, 'account_login_wechat_period_of_validity')}
                filterOption={false}
                placeholder="请选择"
                optionLabelProp="children"
              >
                <Option key="10080">默认，7天（10080分钟）</Option>
                {this.state.options.account_login_wechat_period_of_validity}
              </Select>,
              )}
            <span style={{ paddingLeft: 5 }} >{this.state.duration.account_login_wechat_period_of_validity_duration}</span>
          </FormItem>

          <FormItem
            {...formItemLayout} label={(
              <span>
              有效登录设备数量&nbsp;
                <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.account_login_wechat_allow_count }} />}>
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
          >
            {getFieldDecorator('account_login_wechat_allow_count', {
              initialValue: _.get(securityCheckDefinitionRecord, 'account_login.wechat.allow_count', securityCheckTemplate.account_login.wechat.allow_count).toString(),
              rules: [{
                required: true,
                message: '请选择或者输入PC有效登录设备数量，仅限数字',
                type: 'integer',
                transform: value => _.toNumber(value),
              }],
            })(
              <Select
                  // allowClear
                  // mode="combobox"
                style={{ width: 200 }}
                onChange={this.handleChange.bind(this, 'account_login_wechat_allow_count', [securityCheckTemplate.account_login.wechat.allow_count.toString()])}
                  // onBlur={this.handleDurationTime.bind(this, 'account_login_wechat_allow_count')}
                  // filterOption={false}
                placeholder="请选择"
              >
                <Option key="-1">默认，不限制</Option>
                <Option key="1">1</Option>
                <Option key="2">2</Option>
                <Option key="3">3</Option>
                {/* {this.state.options.account_login_wechat_allow_count}*/}
              </Select>,
              )}
          </FormItem>

        </Panel>

      </Collapse>
    );
  }
}


export default Form.create()(AccountLoginForm);
