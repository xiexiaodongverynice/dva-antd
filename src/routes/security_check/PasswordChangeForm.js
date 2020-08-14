import React from 'react';
import _ from 'lodash';
import { Form, Icon, Tooltip, Select, Switch, InputNumber } from 'antd';
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
 * 密码更改安全策略
 */
class PasswordChangeForm extends React.Component {
  state = {
    options: {
      pwd_min_age: [],
    },
  };

  componentDidMount() {
  }

  handleChange = (type, DVS = [], value) => {
    const { options } = this.state;
    console.log(value, DVS);
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
              允许用户修改密码(s)&nbsp;
            <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.pwd_allow_user_change }} />}>
              <Icon type="question-circle-o" />
            </Tooltip>
            </span>
        )}
        >
          {getFieldDecorator('pwd_allow_user_change', {
            initialValue: _.get(securityCheckDefinitionRecord, 'pwd_allow_user_change', securityCheckTemplate.pwd_allow_user_change),
            valuePropName: 'checked',
          })(
            <Switch />,
            )}
        </FormItem>


        <FormItem
          {...formItemLayout} label={(
            <span>
              必须提供旧密码(s)&nbsp;
            <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.pwd_safe_modify }} />}>
              <Icon type="question-circle-o" />
            </Tooltip>
            </span>
        )}
        >
          {getFieldDecorator('pwd_safe_modify', {
            initialValue: _.get(securityCheckDefinitionRecord, 'pwd_safe_modify', securityCheckTemplate.pwd_safe_modify),
            valuePropName: 'checked',
          })(
            <Switch />,
          )}
        </FormItem>

        <FormItem
          {...formItemLayout} label={(
            <span>
              校验历史密码(次)&nbsp;
            <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.pwd_in_history }} />}>
              <Icon type="question-circle-o" />
            </Tooltip>
            </span>
        )}
        >
          {getFieldDecorator('pwd_in_history', {
            initialValue: _.get(securityCheckDefinitionRecord, 'pwd_in_history', securityCheckTemplate.pwd_in_history),
            rules: [{
              required: true,
              message: '请选择或者输入密码锁定持续时间，仅限数字',
              type: 'integer',
              transform: value => _.toNumber(value),
            }],
          })(
            <InputNumber min={0} />,
          )}
        </FormItem>


        <FormItem
          {...formItemLayout}
          label={(
            <span>
              密码锁定持续时间(s)&nbsp;
              <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.pwd_min_age }} />}>
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
        >
          {getFieldDecorator('pwd_min_age', {
            initialValue: _.get(securityCheckDefinitionRecord, 'pwd_min_age', securityCheckTemplate.pwd_min_age).toString(),
            rules: [{
              required: true,
              message: '请选择或者输入密码修改间隔，仅限数字',
              type: 'number',
              transform: value => _.toNumber(value),
            }],
          })(
            <Select
              allowClear
              mode="combobox"
              style={{ width: 200 }}
              onChange={this.handleChange.bind(this, 'pwd_min_age', ['0', '-1'])}
              filterOption={false}
              placeholder="请选择"
              optionLabelProp="children"
            >
              <Option key="0">默认，不限制</Option>
              {this.state.options.pwd_min_age}
            </Select>,
          )}
        </FormItem>

        <FormItem
          {...formItemLayout} label={(
            <span>
              重置之后必须修改(s)&nbsp;
            <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.pwd_must_change }} />}>
              <Icon type="question-circle-o" />
            </Tooltip>
            </span>
        )}
        >
          {getFieldDecorator('pwd_must_change', {
            initialValue: _.get(securityCheckDefinitionRecord, 'pwd_must_change', securityCheckTemplate.pwd_must_change),
            valuePropName: 'checked',
          })(
            <Switch />,
          )}
        </FormItem>
      </div>
    );
  }
}


export default Form.create()(PasswordChangeForm);
