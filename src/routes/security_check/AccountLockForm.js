import React from 'react';
import _ from 'lodash';
import { Form, Icon, Tooltip, Select } from 'antd';
import securityCheckAnnotation from './securityCheckAnnotation.json';
import securityCheckTemplate from './securityCheckTemplate.json';

const FormItem = Form.Item;
const Option = Select.Option;


const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const formTailLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16, offset: 4 },
};

/**
 * 账户锁定安全策略
 */
class AccountLockForm extends React.Component {
  state = {
    checkNick: false,
    options: {
      pwd_failure_count_interval: [],
      pwd_lockout_duration: [],
      pwd_max_failure: [],
    },
  };

  componentDidMount() {
  }

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

  render() {
    const { form: { getFieldDecorator }, securityCheckDefinitionRecord } = this.props;
    return (
      <div>
        <FormItem
          {...formItemLayout} label={(
            <span>
              密码尝试等待时间(s)&nbsp;
            <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.pwd_failure_count_interval }} />}>
              <Icon type="question-circle-o" />
            </Tooltip>
            </span>
        )}
        >
          {getFieldDecorator('pwd_failure_count_interval', {
            initialValue: _.get(securityCheckDefinitionRecord, 'pwd_failure_count_interval', securityCheckTemplate.pwd_failure_count_interval).toString(),
            rules: [{
              required: true,
              message: '请选择或者输入密码尝试等待时间，仅限数字',
              type: 'integer',
              transform: value => _.toNumber(value),
            }],
          })(
            <Select
              // disabled
              allowClear
              mode="combobox"
              style={{ width: 200 }}
              onChange={this.handleChange.bind(this, 'pwd_failure_count_interval', ['0'])}
              filterOption={false}
              placeholder="请选择"
              optionLabelProp="children"
            >
              <Option key="0">默认，不等待</Option>
              {this.state.options.pwd_failure_count_interval}
            </Select>,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={(
            <span>
              密码锁定持续时间(h)&nbsp;
                      <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.pwd_lockout_duration }} />}>
                        <Icon type="question-circle-o" />
                      </Tooltip>
            </span>
                  )}
        >
          {getFieldDecorator('pwd_lockout_duration', {
            initialValue: _.get(securityCheckDefinitionRecord, 'pwd_lockout_duration', securityCheckTemplate.pwd_lockout_duration).toString(),
            rules: [{
              required: true,
              message: '请选择或者输入密码锁定持续时间，仅限数字',
              type: 'number',
              transform: value => _.toNumber(value),
            }],
          })(
            <Select
              // disabled
              allowClear
              mode="combobox"
              style={{ width: 200 }}
              onChange={this.handleChange.bind(this, 'pwd_lockout_duration', ['0', '-1'])}
              filterOption={false}
              placeholder="请选择"
              optionLabelProp="children"
            >
              <Option key="0">默认，不锁定</Option>
              <Option key="-1">永久锁定</Option>
              {this.state.options.pwd_lockout_duration}
            </Select>,
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={(
            <span>
              允许密码失败次数&nbsp;
                      <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.pwd_max_failure }} />}>
                        <Icon type="question-circle-o" />
                      </Tooltip>
            </span>
                  )}
        >
          {getFieldDecorator('pwd_max_failure', {
            initialValue: '0',
            rules: [{
              required: true,
              message: '请选择或者输入密码失败次数，仅限整数',
              type: 'integer',
              transform: value => _.toNumber(value),
            }],
          })(
            <Select
              // disabled
              allowClear
              mode="combobox"
              style={{ width: 200 }}
              onChange={this.handleChange.bind(this, 'pwd_max_failure', ['0', '1', '2', '3'])}
              filterOption={false}
              placeholder="请选择"
              optionLabelProp="children"
            >
              <Option key="0">默认，不限制</Option>
              <Option key="1">1</Option>
              <Option key="2">2</Option>
              <Option key="3">3</Option>
              {this.state.options.pwd_max_failure}
            </Select>,
          )}
        </FormItem>
      </div>
    );
  }
}


export default Form.create()(AccountLockForm);
