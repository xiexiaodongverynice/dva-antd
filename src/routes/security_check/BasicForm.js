import React from 'react';
import { Form, Input, Button, Tooltip, Switch, Popconfirm, Icon } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const formTailLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16, offset: 4 },
};
class BasicForm extends React.Component {
  state = {
  };

  render() {
    const { form: { getFieldDecorator }, record } = this.props;
    return (
      <div>
        <FormItem
          {...formItemLayout} label={
            <span>
              api_name&nbsp;
            <Tooltip title="API_NAME确定之后将无法修改，请确认后再保存，不支持数据库修改">
              <Icon type="question-circle-o" />
            </Tooltip>
            </span>
        }
        >
          {getFieldDecorator('api_name', {
            initialValue: _.get(record, 'api_name'),
            rules: [{
              required: true,
              message: 'Please input api_name',
            }],
          })(
            <Input placeholder="Please input api_name" disabled={_.has(record, 'api_name')} />,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="名称">
          {getFieldDecorator('name', {
            initialValue: _.get(record, 'name'),
            rules: [{
              required: true,
              message: 'Please input name',
            }],
          })(
            <Input placeholder="Please input name" />,
          )}
        </FormItem>

        <FormItem
          {...formItemLayout} label={
            <span>
              描述&nbsp;
            <Tooltip title="国际化方案，参考https://wiki.forceclouds.com/x/R4b_">
              <Icon type="question-circle-o" />
            </Tooltip>
            </span>
        }
        >
          {getFieldDecorator('description', {
            initialValue: _.get(record, 'description'),
            rules: [{
              required: true,
              message: 'Please input description',
            }],
          })(
            <TextArea rows={4} autosize={{ minRows: 2 }} />,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={'是否启用'}>
          {getFieldDecorator('is_active', {
            initialValue: _.get(record, 'is_active', true),
            valuePropName: 'checked',
          })(
            <Switch />,
          )}
        </FormItem>
        <FormItem {...formTailLayout}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
          <Tooltip title="该重置按钮可重置所有内容" placement={'bottom'}>
            <Popconfirm placement="topLeft" title="是否重置所有输入?" onConfirm={() => this.props.form.resetFields()} okText="确定" cancelText="再想想">
              <Button style={{ marginLeft: '5px' }} size="large">重置</Button>
            </Popconfirm>
          </Tooltip>
        </FormItem>
      </div>
    );
  }
}


export default BasicForm;
