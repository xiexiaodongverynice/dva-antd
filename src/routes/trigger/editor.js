import React from 'react';
import { connect } from 'dva';
import { Link } from 'react-router';
import { Form, Select, Input, Button } from 'antd';
import TriggerScriptEditor from '../../components/trigger/triggerScriptEditor';

const FormItem = Form.Item;
const Option = Select.Option;

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

const TriggerEditor = ({ dispatch, trigger, mode, form }) => {
  const okHandler = () => {
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'triggerEditor/updateTrigger',
          payload: values,
        });
        if (mode === 'add') {
          dispatch({ type: 'triggerEditor/create' });
        }
        if (mode === 'edit') {
          dispatch({ type: 'triggerEditor/creates' });
        }
      }
    });
  };


  const { getFieldDecorator } = form;
  const { name, api_version, describe, script } = trigger;
  return (
    <Form>
      <FormItem
        {...formItemLayout}
        label="API版本"
        hasFeedback
      >
        {getFieldDecorator('api_version', {
          initialValue: api_version,
          rules: [{ required: true, message: '请选择API版本!', whitespace: true }],
        })(
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="选择版本"
            optionFilterProp="children"
            filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            <Option key="V1.0.000.1">V1.0.000.1</Option>
          </Select>,
        )}
      </FormItem>
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
        label="脚本说明"
        hasFeedback
      >
        {getFieldDecorator('describe', {
          initialValue: describe,
          rules: [{ required: true, message: '请输入脚本说明!', whitespace: true }],
        })(
          <Input type="textarea" rows={4} />,
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="动态脚本"
        hasFeedback
      >
        {getFieldDecorator('script', {
          initialValue: script,
          rules: [{ required: true, message: '请输入完整脚本!', whitespace: true }],
        })(
          <TriggerScriptEditor />,
        )}
      </FormItem>
      <FormItem wrapperCol={{ span: 12, offset: 10 }} label="" >
        {
          mode !== 'view' ? (
            <Button key="submit" type="primary" onClick={okHandler.bind(null)} style={{ marginRight: 10 }}>
              {
              mode === 'add' ? '保存' : '修改'
            }
            </Button>
          ) : null
        }
        <Button key="cancel">
          <Link to={'trigger'}>
            返回
          </Link>
        </Button>
      </FormItem>
    </Form>
  );
};

function mapStateToProps(state) {
  const { trigger, mode } = state.triggerEditor;
  return {
    trigger,
    mode,
  };
}

export default connect(mapStateToProps)(Form.create()(TriggerEditor));
