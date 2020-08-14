/**
 * Created by xinli on 06/06/2017.
 */
import React from 'react';
import { hashHistory } from 'dva/router';
import { Button, Form, Input } from 'antd';

import styles from './form.less';

const FormItem = Form.Item;

const ADD_PAGE = '/action_script/add';
const EDIT_PAGE = '/action_script/edit';

class ActionScriptForm extends React.Component {


  componentWillMount() {
  }

  okHandler = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.props.location.pathname === ADD_PAGE) {
          this.props.dispatch({ type: 'action_script/create', payload: values });
        }
        if (this.props.location.pathname === EDIT_PAGE) {
          for (const k in values) {
            this.props.action_script[k] = values[k];
          }
          this.props.dispatch({ type: 'action_script/update', payload: { action_script: this.props.action_script } });
        }
      }
    });
  };
  goBack = () => {
    hashHistory.push('/action_script');
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { name, api_name, api_version, description, script, script_type } = this.props.action_script;
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
        <h3 className={styles.myH3}>{isEditMode ? '修改Action脚本' : '新建Action脚本'}</h3>
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
            label="API版本"
            hasFeedback
          >
            {getFieldDecorator('api_version', {
              initialValue: api_version,
              rules: [{ required: true, message: 'API版本', whitespace: true }],
            })(
              <Input disabled={isEditMode} />,
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
            label="脚本"
            hasFeedback
          >
            {getFieldDecorator('script', {
              initialValue: script,
              rules: [{ required: false, message: '' }],
            })(
              <Input.TextArea rows={20} style={{ fontFamily: 'monospace' }} />,
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

export default Form.create()(ActionScriptForm);
