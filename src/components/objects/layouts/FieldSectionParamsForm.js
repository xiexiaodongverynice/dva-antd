import React, { Component } from 'react';
import { Input, InputNumber, Form, Button } from 'antd';

const FormItem = Form.Item;

class FieldSectionParamsForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      this.props.changeHandler({ ...fieldsValue, type: 'fieldSection', id: this.props.id });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };

    return (
      <Form onSubmit={this.handleSubmit} style={{ paddingTop: '20px' }}>
        <FormItem
          {...formItemLayout}
          label="Header"
          hasFeedback
        >
          {getFieldDecorator('header', {
            rules: [{
              required: true, message: 'Please input title!',
            }],
          })(
            <Input />,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Columns"
          hasFeedback
        >
          {getFieldDecorator('columns', {
            rules: [{
              required: true, message: 'Please input columns!',
            }],
          })(
            <InputNumber />,
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large">应用</Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create({
  mapPropsToFields(props) {
    return {
      header: {
        value: props.params.header || '',
      },
      columns: {
        value: props.params.columns || 1,
      },
      id: props.id,
      changeHandler: props.changeHandler,
    };
  },
})(FieldSectionParamsForm);
