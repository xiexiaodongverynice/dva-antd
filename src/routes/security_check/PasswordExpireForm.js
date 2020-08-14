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
 * 密码过期安全策略
 */
class PasswordExpireForm extends React.Component {
  state = {
    options: {
      pwd_max_age: [],
      pwd_expire_warning: [],
      pwd_grace_auth_n_limit: [],
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

  validatePwdMaxAge = (rule, value, callback) => {
    const { getFieldValue, isFieldValidating, validateFields } = this.props.form;

    if (value < 0) {
      callback(new Error('必须大于0。'));
    }

    if (!isFieldValidating('pwd_expire_warning')) {
      validateFields(['pwd_expire_warning'], { force: true }, (err, values) => {
        if (err) {
          // console.error(err);
        }
      });
    }
    const pwd_expire_warning = getFieldValue('pwd_expire_warning');
    if (value !== 0 && pwd_expire_warning > value) {
      callback(new Error('最大预留期必须大于过期警告时间。'));
    } else {
      callback();
    }
  }

  validatePwdExpireWarning = (rule, value, callback) => {
    const { getFieldValue, isFieldValidating, validateFields } = this.props.form;
    if (value < 0) {
      callback(new Error('必须大于0。'));
    }
    if (!isFieldValidating('pwd_max_age')) {
      validateFields(['pwd_max_age'], { force: true }, (err, values) => {
        if (err) {
          // console.error(err);
        }
      });
    }
    const pwd_max_age = getFieldValue('pwd_max_age');
    if (value !== 0 && pwd_max_age <= value) {
      callback(new Error('过期警告时间必须小于最大预留期。'));
    } else {
      callback();
    }
  }

  validatePwdGraceAuthNLimit = (rule, value, callback) => {
    if (value < 0) {
      callback(new Error('必须大于0。'));
    } else {
      callback();
    }
  }

  render() {
    const { form: { getFieldDecorator }, securityCheckDefinitionRecord } = this.props;
    return (
      <div>
        <FormItem
          {...formItemLayout}
          label={(
            <span>
              密码特定预留期(天)&nbsp;
              <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.pwd_max_age }} />}>
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
        >
          {getFieldDecorator('pwd_max_age', {
            initialValue: _.get(securityCheckDefinitionRecord, 'pwd_max_age', securityCheckTemplate.pwd_max_age).toString(),
            rules: [{
              required: true,
              message: '请选择或者输入密码特定预留期，仅限数字',
              type: 'number',
              transform: value => _.toNumber(value),
            },
              { validator: this.validatePwdMaxAge },
            ],
          })(
            <Select
              allowClear
              mode="combobox"
              style={{ width: 200 }}
              onChange={this.handleChange.bind(this, 'pwd_max_age', ['0'])}
              filterOption={false}
              placeholder="请选择"
              optionLabelProp="children"
            >
              <Option key="0">默认，不强制修改密码</Option>
              {this.state.options.pwd_min_age}
            </Select>,
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={(
            <span>
              密码即将过期警告(天)&nbsp;
              <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.pwd_min_age }} />}>
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
        >
          {getFieldDecorator('pwd_expire_warning', {
            initialValue: _.get(securityCheckDefinitionRecord, 'pwd_expire_warning', securityCheckTemplate.pwd_expire_warning).toString(),
            rules: [{
              required: true,
              message: '请选择或者输入密码即将过期警告时间，该数字必须小于【密码特定预留期】仅限数字',
              type: 'number',
              transform: value => _.toNumber(value),
            },
              { validator: this.validatePwdExpireWarning },
            ],
          })(
            <Select
              allowClear
              mode="combobox"
              style={{ width: 200 }}
              onChange={this.handleChange.bind(this, 'pwd_expire_warning', ['0'])}
              filterOption={false}
              placeholder="请选择"
              optionLabelProp="children"
            >
              <Option key="0">默认，不警告</Option>
              {this.state.options.pwd_expire_warning}
            </Select>,
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={(
            <span>
              宽限登陆次数&nbsp;
              <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.pwd_grace_auth_n_limit }} />}>
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
        >
          {getFieldDecorator('pwd_grace_auth_n_limit', {
            initialValue: _.get(securityCheckDefinitionRecord, 'pwd_grace_auth_n_limit', securityCheckTemplate.pwd_grace_auth_n_limit).toString(),
            rules: [{
              required: true,
              message: '请选择或者输入宽限登录的次数，仅限数字',
              type: 'number',
              transform: value => _.toNumber(value),
            },
              { validator: this.validatePwdGraceAuthNLimit }],
          })(
            <Select
              allowClear
              mode="combobox"
              style={{ width: 200 }}
              onChange={this.handleChange.bind(this, 'pwd_grace_auth_n_limit', ['0'])}
              filterOption={false}
              placeholder="请选择"
              optionLabelProp="children"
            >
              <Option key="0">默认，不宽限</Option>
              {this.state.options.pwd_grace_auth_n_limit}
            </Select>,
          )}
        </FormItem>
      </div>
    );
  }
}


export default Form.create()(PasswordExpireForm);
