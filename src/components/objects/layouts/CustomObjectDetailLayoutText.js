import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class CustomObjectDetailLayoutText extends Component {
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        try {
          const json = JSON.parse(values.layoutJson);
          this.props.submitHandler(json);
        } catch (error) {
          alert('JSON parse error!'); /* eslint no-alert: [0] */
        }
      }
    });
  }

  handlePreview = (e) => {
    e.preventDefault();
    try {
      const json = JSON.parse(e.currentTarget.form.getElementsByTagName('textarea')[0].value);
      this.props.previewHandler(json);
    } catch (error) {
      alert('JSON parse error!'); /* eslint no-alert: [0] */
    }
  }

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
          })(
            <Input type="textarea" rows={40} placeholder="Layout json" />,
          )}
        </FormItem>
        <FormItem>
          <Button
            onClick={this.handlePreview}
            disabled={hasErrors(getFieldsError())}
            style={{ marginRight: '24px' }}
          >
            Preview
          </Button>
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

export default Form.create({
  onValuesChange(props, values) {
    props.changeHandler(values.layoutJson);
  },
  mapPropsToFields(props) {
    return {
      layoutJson: {
        value: props.layout ? props.layout.raw : '',
      },
    };
  },
})(CustomObjectDetailLayoutText);
