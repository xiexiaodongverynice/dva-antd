import React, { Component } from 'react';
// eslint-disable-next-line no-unused-vars
import { Button, Form, Select, Input, Modal, Row, Col, Icon, message, Switch, DatePicker } from 'antd';
import _ from 'lodash';
// eslint-disable-next-line no-unused-vars
import Style from '../layout/layoutEditor.less';
import DynamicFieldSet from '../objects/DynamicFieldSet';
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
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

class RenderModal extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  state = {
    visible: this.props.visible,
    initValue: this.props.initValue,
    isEdit: this.props.isEdit,
    renderOption: false,
    required: _.get(this.props.initValue, 'required', true),
    OptionTime: _.get(this.props.initValue, 'type', ''),
    default_value2: _.get(this.props.initValue, 'default_value', ''),
    default_value: _.get(this.props.initValue, 'default_value', ''),
  };

  componentWillReceiveProps(nextProps) {
    const { visible, initValue, isEdit } = nextProps;
    if (visible !== this.state.visible) {
      this.setState({
        visible,
      });
    }
    if (initValue !== this.state.initValue) {
      this.setState({
        initValue,
        required: _.get(initValue, 'required', true),
        OptionTime: _.get(initValue, 'type', ''),
        default_value2: _.get(initValue, 'default_value', ''),
        default_value: _.get(initValue, 'default_value', ''),
      });
    }
    if (isEdit !== this.state.isEdit) {
      this.setState({
        isEdit,
      });
    }
    if (visible === true && this.props.visible === false && initValue.type === 'select_multiple') {
      this.setState({
        renderOption: true,
      });
    }
  }

  // eslint-disable-next-line react/sort-comp
  handleOk = (e) => {
    const { addParams } = this.props;
    const { initValue, isEdit } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.type === 'date_time_parameter' && !_.isEmpty(values.default_value2)) {
          values.default_value = values.default_value2;
        }

        if (_.isEmpty(this.options) && values.type === 'select_multiple' && !_.get(initValue, 'options')) {
          message.error('请输入选项值');
          return;
        }
        if (!_.isEmpty(initValue)) {
          // eslint-disable-next-line no-underscore-dangle
          const _key = _.get(initValue, 'key');
          _.set(values, 'key', _key);
        }
        if (values.type === 'date_time_parameter' && !_.isEmpty(values.default_value)) {
          values.default_value = moment(values.default_value).format('YYYY-MM-DD HH:mm:ss');
        }
        this.setState({
          visible: false,
          renderOption: false,
        });
        if (values.type === 'select_multiple') {
          values.options = this.options;
        }
        if (values.type === 'select_multiple' && isEdit && _.isEmpty(this.options)) {
          values.options = initValue.options;
        }
        addParams(values);
        // if (!isEdit) {
        this.options = [];
        // }
        this.props.form.resetFields();
      }
    });
  };

  handleChange = (value) => {
    if (value === 'select_multiple') {
      this.setState({
        renderOption: true,
        OptionTime: value,
        default_value2: '',
        default_value: '',
      });
    } else {
      this.setState({
        renderOption: false,
        OptionTime: value,
        default_value2: '',
        default_value: '',
      });
    }
  };

  options = [];

  synOptions = (options) => {
    this.options = options;
  };

  renderOption = () => {
    const { initValue } = this.state;
    const WrappedDynamicFieldSetOne = Form.create({})(DynamicFieldSet);
    return (
      <WrappedDynamicFieldSetOne
        stylesParams={{ span: 8, offset: 3, style: { width: '80%', marginLeft: '55px' } }}
        options={initValue.options ? initValue.options : this.options}
        synOptions={this.synOptions}
      />
    );
  };

  handleClose = () => {
    const { handleCancel, isEdit } = this.props;
    handleCancel();
    if (!isEdit) {
      this.options = [];
    }
    this.setState({
      renderOption: false,
    });
    this.props.form.resetFields();
  };
  requiredonChange = (checked) => {
    this.setState({ required: checked });
  };
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const {
      visible,
      initValue,
      isEdit,
      renderOption,
      required,
      OptionTime,
      default_value2,
      default_value,
    } = this.state;
    const api_name = _.get(initValue, 'api_name', '');
    const name = _.get(initValue, 'name', '');
    const remark = _.get(initValue, 'remark', '');
    const type = _.get(initValue, 'type', '');
    return (
      <Modal
        className="params_set_modal"
        title={isEdit ? '编辑参数' : '新建参数'}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleClose}
        footer={[
          <Button key="submit" htmlType="submit" type="primary" onClick={this.handleOk}>
            提交
          </Button>,
          <Button key="back" onClick={this.handleClose}>
            返回
          </Button>,
        ]}
      >
        <Form>
          <FormItem {...formItemLayout} label="参数名称" hasFeedback>
            {getFieldDecorator('name', {
              initialValue: name,
              rules: [{ required: true, message: '请输入参数名称!', whitespace: true }],
            })(<Input placeholder="单行输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="api_name" hasFeedback>
            {getFieldDecorator('api_name', {
              initialValue: api_name,
              rules: [{ required: true, message: '请输入API_NAME!', whitespace: true }],
            })(<Input placeholder="单行输入" disabled={isEdit} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="类型" hasFeedback>
            {getFieldDecorator('type', {
              initialValue: type,
              rules: [{ required: true, message: '请选择类型!' }],
            })(
              <Select size="default" style={{ width: '100%' }} onChange={this.handleChange}>
                <Option value="select_multiple">多选</Option>
                <Option value="date_time_parameter">日期时间</Option>
                <Option value="text_parameter">文本</Option>
                <Option value="list_parameter">列表</Option>
              </Select>,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否必填" hasFeedback>
            {getFieldDecorator('required', {
              initialValue: required,
              rules: [{ required: false }],
            })(<Switch checked={required} disabled={false} onChange={this.requiredonChange} />)}
          </FormItem>
          {OptionTime === 'date_time_parameter' ? (
            <FormItem {...formItemLayout} label="默认值" hasFeedback>
              {getFieldDecorator('default_value2', {
                initialValue: _.isEmpty(default_value2) ? default_value2 : moment(default_value2, dateFormat),
              })(<DatePicker style={{ width: '280px' }} showTime placeholder="选择日期和时间" format={dateFormat} />)}
            </FormItem>
          ) : (
            <FormItem {...formItemLayout} label="默认值" hasFeedback>
              {getFieldDecorator('default_value', {
                initialValue: default_value,
                rules: [{ required: false }],
              })(<TextArea placeholder="请填写默认值" />)}
            </FormItem>
          )}
          <FormItem {...formItemLayout} label="描述" hasFeedback>
            {getFieldDecorator('remark', {
              initialValue: remark,
              rules: [{ required: false }],
            })(<TextArea />)}
          </FormItem>
          {renderOption && (
            <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <div style={{ marginLeft: '60px', marginBottom: '22px' }}>
                {' '}
                <span style={{ color: 'red' }}>*</span> 选项（value值必须与对应字段的值完全一致）
              </div>
              {this.renderOption()}
            </div>
          )}
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(RenderModal);
