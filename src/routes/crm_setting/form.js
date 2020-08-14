/**
 * Created by xinli on 06/06/2017.
 */
import React from 'react';
import { hashHistory } from 'dva/router';
import { Button, Form, Input, Row, Col, Select } from 'antd';
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/mode/html';
import 'brace/mode/velocity';
import 'brace/theme/github';
import 'brace/ext/searchbox';

import styles from './form.less';

const FormItem = Form.Item;
const Option = Select.Option;

const ADD_PAGE = '/crm_setting/create';
const EDIT_PAGE = '/crm_setting/edit';

class AceWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      mode: props.mode || 'json',
    };
    this.onChange = props.onChange;
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      value: newProps.value,
    });
  }

  onEditorContentChange(value) {
    this.setState({
      value,
    });
    if (this.onChange) {
      this.onChange(value);
    }
  }

  onModeChange(value) {
    this.setState({
      mode: value,
    });
  }

  render() {
    const { value, mode } = this.state;
    const maxLines = 80;
    const minLines = 50;
    const modeOptions = ['json', 'html'];
    const Option = Select.Option;
    return (
      <div>
        <Row style={{ padding: '5px' }}>
          <Col span={4}>
            <Select placeholder="选择主题" onChange={this.onModeChange.bind(this)} defaultValue={mode}>
              {modeOptions.map((x) => (
                <Option key={x} value={x}>
                  {x}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <AceEditor
              mode={mode}
              theme="github"
              name="UNIQUE_ID_OF_DIV"
              onChange={this.onEditorContentChange.bind(this)}
              editorProps={{ $blockScrolling: true }}
              value={value}
              width="100%"
              maxLines={maxLines}
              minLines={minLines}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

class CRMSettingForm extends React.Component {
  componentWillMount() {}

  okHandler = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('okHandler', values);
        console.log('location.pathname', this.props.location.pathname);
        if (this.props.location.pathname === ADD_PAGE) {
          this.props.dispatch({ type: 'crm_setting_create/create', payload: values });
        }
        if (this.props.location.pathname === EDIT_PAGE) {
          for (const k in values) {
            this.props.body[k] = values[k];
          }
          this.props.dispatch({ type: 'crm_setting_edit/update', payload: this.props.body });
        }
      }
    });
  };
  goBack = () => {
    hashHistory.push('/crm_setting/index');
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { name, api_name, description, value, type } = this.props.body;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 20, pull: 19 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };

    const formTypeItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 21, pull: 20 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
    };
    const isEditMode = this.props.location.pathname === EDIT_PAGE;

    return (
      <div>
        <h3 className={styles.myH3}>{isEditMode ? '修改设置' : '新建设置'}</h3>
        <Form>
          <FormItem {...formItemLayout} label="名称" hasFeedback>
            {getFieldDecorator('name', {
              initialValue: name,
              rules: [{ required: true, message: '请输入名称!', whitespace: true }],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="API_NAME" hasFeedback>
            {getFieldDecorator('api_name', {
              initialValue: api_name,
              rules: [{ required: true, message: '请输入API Name!', whitespace: true }],
            })(<Input disabled={isEditMode} />)}
          </FormItem>
          <FormItem {...formTypeItemLayout} label="类型" hasFeedback>
            {getFieldDecorator('type', {
              initialValue: type,
              rules: [{ required: true, message: '请选择类型!', whitespace: true }],
            })(
              <Select placeholder="请选择类型">
                <Option value="app_home_config">移动端首页设置</Option>
                <Option value="alert">通知模板</Option>
                <Option value="print">打印模板</Option>
                <Option value="calendar">日历模板</Option>
                <Option value="workflow">工作流属性</Option>
                <Option value="default_language">默认语言</Option>
                <Option value="logo">logo设置</Option>
              </Select>,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="描述" hasFeedback>
            {getFieldDecorator('description', {
              initialValue: description,
              rules: [{ required: false, message: '' }],
            })(<Input.TextArea rows={2} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="值" hasFeedback>
            {getFieldDecorator('value', {
              initialValue: value,
              rules: [{ required: false, message: '' }],
            })(<AceWrapper mode="velocity" />)}
          </FormItem>
          <FormItem wrapperCol={{ span: 12, offset: 8 }}>
            <Button className={styles.buttonStyle} type="primary" onClick={this.okHandler}>
              保存
            </Button>
            <Button className={styles.buttonStyle} onClick={this.goBack}>
              返回列表
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(CRMSettingForm);
