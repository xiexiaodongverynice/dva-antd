import React from 'react';
import { hashHistory } from 'dva/router';
import { Button, Form, Input, Radio } from 'antd';

import styles from './form.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

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
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

class RoleForm extends React.Component {

  state = {
    value: undefined,
  }
  onChange = (value) => {
    this.setState({ value });
  }
  okHandler = () => {
    const { form, location, dispatch, role } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (location.pathname == '/role/add') {
          dispatch({
            type: 'roles/create',
            payload: values,
          });
        } else if (location.pathname == '/role/edit') {
          dispatch({
            type: 'roles/editRole',
            payload: Object.assign({}, role, values),
          });
        }
      }
    });
  };
  okHandlers = () => {
    const { form, location, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (location.pathname == '/role/add') {
          dispatch({
            type: 'roles/creates',
            payload: Object.assign({}, values, { form }),
          });
        }
      }
    });
  };

  goBack = () => {
    hashHistory.push('/role');
  };


  render() {
    const { form: { getFieldDecorator }, role: { name, job, api_name, external_id }, location } = this.props;
    return (
      <div>
        <h3 className={styles.myH3}>
          {
            location.pathname == '/role/edit' ? '修改角色' : '新建角色'
          }
        </h3>
        <Form>
          <FormItem
            {...formItemLayout}
            label="角色名"
            hasFeedback
          >
            {getFieldDecorator('name', {
              initialValue: name,
              rules: [{ required: true, message: '请输入角色名!', whitespace: true }],
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
          <h3 className={styles.myH3}>数据权限</h3>
          <FormItem
            wrapperCol={{ span: 12, offset: 8 }}
          >
            {getFieldDecorator('job', {
              initialValue: job,
              rules: [{ required: true, message: '请选择数据权限!' }],
            })(
              <RadioGroup >
                <Radio style={radioStyle} value={2}>本岗</Radio>
                <Radio style={radioStyle} value={4}>本岗及本岗下属</Radio>
                <Radio style={radioStyle} value={6}>全部</Radio>
              </RadioGroup>,
            )}
          </FormItem>
          <FormItem
            wrapperCol={{ span: 12, offset: 8 }}
          >
            <Button className={styles.buttonStyle} type="primary" onClick={this.okHandler}>保存</Button>
            <Button
              className={location.pathname == '/role/edit' ? styles.editButton : styles.buttonStyle}
              type="primary" onClick={this.okHandlers}
            >保存并新建</Button>
            <Button className={styles.buttonStyle} type="primary" onClick={this.goBack}>取消</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(RoleForm);
