import React, { Component } from 'react';
import { Select, Form, Button } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class FieldParamsForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      this.props.changeHandler({ ...fieldsValue, required: fieldsValue.required === 'true', type: 'field', id: this.props.id });
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
          label="必填"
          hasFeedback
        >
          {getFieldDecorator('required')(
            <Select>
              <Option value="true">Yes</Option>
              <Option value="false">No</Option>
            </Select>,
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
      required: {
        value: (props.params.required || false).toString(),
      },
      id: props.id,
      changeHandler: props.changeHandler,
    };
  },
})(FieldParamsForm);
