/**
 * Created by xinli on 06/06/2017.
 */
import React from 'react';
import { hashHistory } from 'dva/router';
import { Button, Form, Input, Select } from 'antd';
import prettyJSONStringify from 'pretty-json-stringify';
import yaml from 'js-yaml';
import ApprovalFlowEditor from './approvalFlowEditor';


import styles from './form.less';

const FormItem = Form.Item;
const Option = Select.Option;

const ADD_PAGE = '/approval_flow/add';
const EDIT_PAGE = '/approval_flow/edit';

class ApprovalFlowForm extends React.Component {


  componentWillMount() {
  }

  okHandler = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { editor_value: { format, content } } = values;
        const flow_definition = this.evalEditorContent(format, content);
        delete values.editor_value;
        values.flow_definition = flow_definition;
        if (this.props.location.pathname === ADD_PAGE) {
          this.props.dispatch({ type: 'approval_flow/create', payload: values });
        }
        if (this.props.location.pathname === EDIT_PAGE) {
          for (const k in values) {
            this.props.approval_flow[k] = values[k];
          }
          this.props.dispatch({ type: 'approval_flow/update', payload: { approval_flow: this.props.approval_flow } });
        }
      }
    });
  };
  goBack = () => {
    hashHistory.push('/approval_flow/index');
  };

  evalEditorContent(format, content) {
    if (format === 'json') {
      return JSON.parse(content);
    }
    if (format === 'yaml') {
      return yaml.safeLoad(content);
    }
    return {};
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { name, api_name, api_version, description, flow_definition, object_describe_api_name } = this.props.approval_flow;
    const flow_definition_json = prettyJSONStringify(flow_definition || {});
    const editor_value = {
      content: flow_definition_json,
      format: 'json',
    };
    const object_describes = this.props.object_describes;
    const objectDescribeOptions = object_describes
      .filter((x) => x.enable_approval_flow == true)
      .map(x => <Option key={x.api_name} value={x.api_name}>{x.display_name}</Option>);
    // const objectDescibeOptions = (
    //   <Option value="jack">Jack</Option>,
    //   <Option value="jack">Jack</Option>
    // );
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
    const isEditMode = this.props.location.pathname === EDIT_PAGE;

    return (
      <div>
        <h3 className={styles.myH3}>{isEditMode ? '修改审批流' : '新建审批流'}</h3>
        <Form>
          <FormItem
            {...formItemLayout}
            label="名称"
            hasFeedback
          >
            {getFieldDecorator('name', {
              initialValue: name,
              rules: [{ required: true, message: '请输入名称!', whitespace: true }],
            })(
              <Input />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="API_NAME"
            hasFeedback
          >
            {getFieldDecorator('api_name', {
              initialValue: api_name,
              rules: [{ required: true, message: '请输入API Name!', whitespace: true }],
            })(
              <Input disabled={isEditMode} />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="相关对象"
            hasFeedback
          >
            {getFieldDecorator('object_describe_api_name', {
              initialValue: object_describe_api_name,
              rules: [{ required: true, message: '请选择相关对象', whitespace: true }],
            })(
              <Select
                showSearch
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {objectDescribeOptions}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="描述"
            hasFeedback
          >
            {getFieldDecorator('description', {
              initialValue: description,
              rules: [{ required: false, message: '' }],
            })(
              <Input.TextArea rows={2} />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="流程定义"
            hasFeedback
          >
            {getFieldDecorator('editor_value', {
              initialValue: editor_value,
              rules: [{ required: false, message: '' }],
            })(
              <ApprovalFlowEditor />,
            )}
          </FormItem>

          <FormItem
            wrapperCol={{ span: 12, offset: 8 }}
          >
            <Button className={styles.buttonStyle} type="primary" onClick={this.okHandler}>保存</Button>
            <Button className={styles.buttonStyle} onClick={this.goBack}>返回列表</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(ApprovalFlowForm);
