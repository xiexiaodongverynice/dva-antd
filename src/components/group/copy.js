import React, { Component } from 'react';
import { hashHistory } from 'dva/router';
import { Button, Form, Input } from 'antd';
import styles from './form.less';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
};
class GroupCopy extends Component {
  // 保存
  okHandler = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.permission = this.props.copyGroup.permission;
        this.props.dispatch({ type: 'groups/create', payload: values });
      }
    });
  };

  // 取消
  goBack = () => {
    hashHistory.push('/group');
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { describe, name } = this.props.group;

    return (
      <div>
        <h2>复制：{this.props.copyGroup.label}</h2>
        <div className={styles.mybutton}>
          <Button type="primary" onClick={this.okHandler}>保存</Button>
          <Button type="primary" onClick={this.goBack}>取消</Button>
        </div>
        <h3 className={styles.myH3}>
          步骤1. 输入权限组名称
        </h3>
        <Form>
          <FormItem
            {...formItemLayout}
            label="权限组名称"
            hasFeedback
          >
            {getFieldDecorator('name', {
              initialValue: name,
              rules: [{ required: true, message: '输入权限名称!', whitespace: true }],
            })(
              <Input />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="描述"
            hasFeedback
          >
            {getFieldDecorator('describe', {
              initialValue: describe,
            })(
              <Input type="textarea" rows={4} />,
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(GroupCopy);
