import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class CustomObjectDetailLayout extends Component {
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.submitHandler({ body: JSON.parse(values.layoutJson) });
      }
    });
  };
  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    // Only show error after a field is touched.
    const layoutJsonError = isFieldTouched('layoutJson') && getFieldError('layoutJson');
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          validateStatus={layoutJsonError ? 'error' : ''}
          help={layoutJsonError || ''}
        >
          {getFieldDecorator('layoutJson', {
            rules: [{ required: true, message: 'Please input the layout JSON!' }],
            initialValue: this.props.layout && JSON.stringify(this.props.layout, null, '\t'),
          })(
            <Input type="textarea" rows={40} placeholder="Layout json" />,
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            Submit
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(CustomObjectDetailLayout);
