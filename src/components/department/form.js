import React from 'react';
import { hashHistory } from 'dva/router';
import { connect } from 'dva';
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

const departmentForm = (props) => {
  const { location, form, dispatch, department } = props;
  // 点击保存
  const okHandler = () => {
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (location.pathname == '/department/add') {
          dispatch({ type: 'departments/create', payload: values });
        }
        if (location.pathname == '/department/edit') {
          for (const k in values) {
            if (k) {
              department[k] = values[k];
            }
          }
          dispatch({ type: 'departments/editdepartment', payload: department });
        }
      }
    });
  };

  // 点击保存并继续
  const okHandlers = () => {
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (location.pathname == '/department/add') {
          dispatch({ type: 'departments/creates', payload: Object.assign({}, values, { form }) });
        }
      }
    });
  };

  // 点击取消跳转
  const goBack = () => {
    hashHistory.push('/department');
  };

  const { getFieldDecorator } = form;
  const { name, api_name, external_id } = department;
  return (
    <div>
      <h3 className={styles.myH3}>新建部门</h3>
      <Form>
        <FormItem
          {...formItemLayout}
          label="部门名"
          hasFeedback
        >
          {getFieldDecorator('name', {
            initialValue: name,
            rules: [{ required: true, message: '请输入部门名!', whitespace: true }],
          })(
            <Input />,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="API名称"
          hasFeedback
        >
          {getFieldDecorator('api_name', {
            initialValue: api_name,
            rules: [{ required: true, message: '请输入API名称!', whitespace: true }],
          })(
            <Input />,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="外部ID"
          hasFeedback
        >
          {getFieldDecorator('external_id', {
            initialValue: external_id,
            rules: [{ required: true, message: '请输入外部ID!', whitespace: true }],
          })(
            <Input />,
          )}
        </FormItem>
      </Form>
      <div className={styles.mybutton}>
        <Button type="primary" onClick={okHandler}>保存</Button>
        <Button
          type="primary" onClick={okHandlers}
          className={location.pathname == '/department/edit' ? styles.editButton : styles.buttonStyle}
        >保存并新建</Button>
        <Button type="primary" onClick={goBack}>取消</Button>
      </div>
    </div>
  );
};

export default connect(({ departments: {
  department,
} }) => {
  return {
    department,
  };
})(Form.create({
  onValuesChange: (props, values) => {
    const { dispatch } = props;
    dispatch({
      type: 'departments/deepAssignDepartment',
      payload: values,
    });
  },
})(departmentForm));
