import React, { Component } from 'react';
import { Select, Form, Button } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class RelatedListParamsForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      this.props.changeHandler({ ...fieldsValue, type: 'relatedList', id: this.props.id });
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

    const columnOptions = this.props.params.refObj.fields.map(
      col => <Option key={col.id} value={col.api_name}>{col.label}</Option>,
    );

    return (
      <Form onSubmit={this.handleSubmit} style={{ paddingTop: '20px' }}>
        <FormItem
          {...formItemLayout}
          label="Fields"
          hasFeedback
        >
          {getFieldDecorator('fields', {
            rules: [{
              required: true, message: 'Please input display fields!',
            }],
          })(
            <Select mode="multiple">
              {columnOptions}
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
      id: props.id,
      columnOptions: props.params.refObj.fields,
      fields: { value: props.params.item.fields && props.params.item.fields.map(f => f.field) },
      changeHandler: props.changeHandler,
    };
  },
})(RelatedListParamsForm);
