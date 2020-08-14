import React, { Component } from 'react';
import { Select, Form, Button } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class RelatedListColumnParamsForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.props.changeHandler({
        ...fieldsValue,
        type: 'relatedListColumn',
        id: this.props.id,
        container: { type: 'relatedList', id: this.props.containerId },
      });
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
          label="显示类型"
          hasFeedback
        >
          {getFieldDecorator('render_type')(
            <Select>
              <Option value="text">text</Option>
              <Option value="select">Select</Option>
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
      render_type: {
        value: props.params.render_type,
      },
      id: props.id,
      containerId: props.containerId,
      changeHandler: props.changeHandler,
    };
  },
})(RelatedListColumnParamsForm);
