import React, { Component } from 'react';
import { hashHistory } from 'dva/router';
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

class dutiesForm extends Component {

  // 点击保存
  okHandler = () => {
    const { form, location, duties, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (location.pathname == '/duties/add') {
          dispatch({
            type: 'dutiess/create',
            payload: values,
          });
        }
        if (location.pathname == '/duties/edit') {
          dispatch({
            type: 'dutiess/editduties',
            payload: Object.assign({}, duties, values),
          });
        }
      }
    });
  };

  // 点击保存并继续
  okHandlers = () => {
    const { form, location, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (location.pathname == '/duties/add') {
          dispatch({
            type: 'dutiess/creates',
            payload: Object.assign({}, values, { form }),
          });
        }
      }
    });
  };

  // 点击取消跳转
  goBack = () => {
    hashHistory.push('/duties');
  };


  render() {
    const { form: { getFieldDecorator }, duties: { name, api_name, external_id }, location } = this.props;
    return (
      <div>
        <h3 className={styles.myH3}>新建职务</h3>
        <Form>
          <FormItem
            {...formItemLayout}
            label="职务名"
            hasFeedback
          >
            {getFieldDecorator('name', {
              initialValue: name,
              rules: [{ required: true, message: '请输入职务名!', whitespace: true }],
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
          <Button type="primary" onClick={this.okHandler}>保存</Button>
          <Button
            type="primary" onClick={this.okHandlers}
            className={location.pathname == '/duties/edit' ? styles.editButton : styles.buttonStyle}
          >保存并新建</Button>
          <Button type="primary" onClick={this.goBack}>取消</Button>
        </div>
      </div>
    );
  }
}

export default Form.create()(dutiesForm);
