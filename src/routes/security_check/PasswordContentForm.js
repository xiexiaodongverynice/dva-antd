import React from 'react';
import _ from 'lodash';
import { Form, Icon, Tooltip, Select, Switch, InputNumber, Checkbox, Row, Col } from 'antd';
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
 * 密码内容安全策略
 */
class PasswordContentForm extends React.Component {
  state = {
    options: {
      pwd_max_length: [],
    },
  };

  componentDidMount() {
  }

  onChange=(checkedValues) => {
    console.log('checked = ', checkedValues);
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
  validatePwdMaxLength = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;

    const pwd_min_length = getFieldValue('pwd_min_length');
    if (_.toInteger(value) !== 0 && pwd_min_length > _.toInteger(value)) {
      callback(new Error('密码最大长度必须大于密码最小长度。'));
    } else {
      callback();
    }
  }
  validatePwdMinLength = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;

    const pwd_max_length = _.toInteger(getFieldValue('pwd_max_length'));
    if (pwd_max_length > 0 && pwd_max_length < value) {
      callback(new Error('密码的最小长度必须小于最大长度。'));
    } else {
      callback();
    }
  }
  validatePSCRC1 = (rule, value, callback) => {
    const { getFieldValue, isFieldValidating, validateFields } = this.props.form;
    if (!isFieldValidating('pwd_strong_check_require_charset_1')) {
      validateFields(['pwd_strong_check_require_charset_1'], { force: true }, (err, values) => {
        if (err) {
          // console.error(err);
        }
      });
    }
    const pwd_strong_check_require_charset_1 = getFieldValue('pwd_strong_check_require_charset_1');
    if (_.toInteger(pwd_strong_check_require_charset_1) > value.length) {
      callback(new Error('密码复杂度种类必须大于等于密码复杂度组合。'));
    } else {
      callback();
    }
  }
  validatePSCRC2 = (rule, value, callback) => {
    const { getFieldValue, isFieldValidating, validateFields } = this.props.form;
    if (!isFieldValidating('pwd_strong_check_require_charset_0')) {
      validateFields(['pwd_strong_check_require_charset_0'], { force: true }, (err, values) => {
        if (err) {
          // console.error(err);
        }
      });
    }
    const pwd_strong_check_require_charset_0 = getFieldValue('pwd_strong_check_require_charset_0');
    if (pwd_strong_check_require_charset_0.length < _.toInteger(value)) {
      callback(new Error('密码复杂度组合必须小于等于密码复杂度种类。'));
    } else {
      callback();
    }
  }
  render() {
    const { form: { getFieldDecorator }, securityCheckDefinitionRecord } = this.props;


    const pwd_strong_check_require_charset = _.get(securityCheckDefinitionRecord, 'pwd_strong_check_require_charset', securityCheckTemplate.pwd_strong_check_require_charset);
    let pwd_strong_check_require_charset_1;
    if (pwd_strong_check_require_charset.length == 1) {
      pwd_strong_check_require_charset_1 = 0;
    } else {
      pwd_strong_check_require_charset_1 = pwd_strong_check_require_charset[1];
    }

    return (
      <div>
        <FormItem
          {...formItemLayout}
          label={(
            <span>
              是否强制检查密码内容&nbsp;
              <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.pwd_check_quality }} />}>
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
        >
          {getFieldDecorator('pwd_check_quality', {
            initialValue: _.get(securityCheckDefinitionRecord, 'pwd_check_quality', securityCheckTemplate.pwd_check_quality).toString(),
          })(
            <Select
              style={{ width: 200 }}
              placeholder="请选择"
              optionLabelProp="children"
            >
              <Option key="0">默认，不强制执行检查</Option>
              <Option key="1">强制检查并记录警告</Option>
              <Option key="2">强制检查并拒绝</Option>
            </Select>,
          )}
        </FormItem>

        <FormItem
          {...formItemLayout} label={(
            <span>
              最小长度&nbsp;
            <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.pwd_min_length }} />}>
              <Icon type="question-circle-o" />
            </Tooltip>
            </span>
        )}
        >
          {getFieldDecorator('pwd_min_length', {
            initialValue: _.get(securityCheckDefinitionRecord, 'pwd_min_length', securityCheckTemplate.pwd_min_length),
            rules: [{
              required: true,
              message: '请选择或者输入密码最小长度，仅限数字',
              type: 'integer',
              transform: value => _.toNumber(value),
            },
              { validator: this.validatePwdMinLength }],
          })(
            <InputNumber min={securityCheckTemplate.pwd_min_length} />,
          )}
        </FormItem>


        <FormItem
          {...formItemLayout} label={(
            <span>
              最大长度&nbsp;
            <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.pwd_max_length }} />}>
              <Icon type="question-circle-o" />
            </Tooltip>
            </span>
        )}
        >
          {getFieldDecorator('pwd_max_length', {
            initialValue: _.get(securityCheckDefinitionRecord, 'pwd_max_length', securityCheckTemplate.pwd_max_length).toString(),
            rules: [{
              required: true,
              message: '请选择或者输入密码最大长度，仅限数字',
              type: 'integer',
              transform: value => _.toNumber(value),
            },
              { validator: this.validatePwdMaxLength },
            ],
          })(
            <Select
              allowClear
              mode="combobox"
              style={{ width: 200 }}
              onChange={this.handleChange.bind(this, 'pwd_max_length', ['0', '8', '12', '16'])}
              filterOption={false}
              placeholder="请选择"
              optionLabelProp="children"
            >
              <Option key="0">默认，不限制</Option>
              <Option key="8">8</Option>
              <Option key="12">12</Option>
              <Option key="16">16</Option>
              {this.state.options.pwd_max_length}
            </Select>,
          )}
        </FormItem>


        <FormItem
          {...formItemLayout} label={(
            <span>
              是否弱单词检查&nbsp;
            <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.pwd_strong_check_lower_words }} />}>
              <Icon type="question-circle-o" />
            </Tooltip>
            </span>
        )}
        >
          {getFieldDecorator('pwd_strong_check_lower_words', {
            initialValue: _.get(securityCheckDefinitionRecord, 'pwd_strong_check_lower_words', securityCheckTemplate.pwd_strong_check_lower_words),
            valuePropName: 'checked',
          })(
            <Switch />,
          )}
        </FormItem>


        <FormItem
          {...formItemLayout} label={(
            <span>
              验证与登录账户相同&nbsp;
            <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.pwd_strong_check_same_login_name }} />}>
              <Icon type="question-circle-o" />
            </Tooltip>
            </span>
        )}
        >
          {getFieldDecorator('pwd_strong_check_same_login_name', {
            initialValue: _.get(securityCheckDefinitionRecord, 'pwd_strong_check_same_login_name', securityCheckTemplate.pwd_strong_check_same_login_name),
            valuePropName: 'checked',
          })(
            <Switch />,
          )}
        </FormItem>


        <FormItem
          {...formItemLayout} label={(
            <span>
              密码复杂度种类&nbsp;
            <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.pwd_strong_check_require_charset }} />}>
              <Icon type="question-circle-o" />
            </Tooltip>
            </span>
        )}
        >
          {getFieldDecorator('pwd_strong_check_require_charset_0', {
            initialValue: _.split(_.get(securityCheckDefinitionRecord, 'pwd_strong_check_require_charset', securityCheckTemplate.pwd_strong_check_require_charset)[0], '&&'),
            rules: [{
              required: true,
              message: '请选择密码复杂度种类',
            }, { validator: this.validatePSCRC1 }],
          })(
            <Checkbox.Group onChange={this.onChange.bind(this)}>
              <Row>
                <Col span={6}><Checkbox value="lower">小写字母</Checkbox></Col>
                <Col span={6}><Checkbox value="upper">大写字母</Checkbox></Col>
                <Col span={6}><Checkbox value="digit">数字</Checkbox></Col>
                <Col span={6}><Checkbox value="special">
                  特殊符号&nbsp;<Tooltip title={'!@#$%^&*()/|\\[\\]{}.,:;\'"\\-_=+?<>'}>
                    <Icon type="question-circle-o" />
                  </Tooltip></Checkbox></Col>
              </Row>
            </Checkbox.Group>,
          )}
        </FormItem>

        <FormItem
          {...formItemLayout} label={(
            <span>
              密码复杂度组合&nbsp;
            <Tooltip title={<span dangerouslySetInnerHTML={{ __html: securityCheckAnnotation.pwd_strong_check_require_charset }} />}>
              <Icon type="question-circle-o" />
            </Tooltip>
            </span>
        )}
        >
          {getFieldDecorator('pwd_strong_check_require_charset_1', {
            initialValue: pwd_strong_check_require_charset_1.toString(),
            rules: [{ validator: this.validatePSCRC2 }],
          })(
            <Select
              style={{ width: 200 }}
              placeholder="请选择"
              optionLabelProp="children"
            >
              <Option key="0">默认，全部</Option>
              <Option key="2">至少以上两种</Option>
              <Option key="3">至少以上三种</Option>
            </Select>
            ,
          )}
        </FormItem>
      </div>
    );
  }
}


export default Form.create()(PasswordContentForm);
