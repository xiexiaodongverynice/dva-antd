import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import styles from './login.less';

const FormItem = Form.Item;

const LoginModel = ({
                      dispatch,
                      form: {
                        getFieldDecorator,
                        validateFieldsAndScroll,
                      },
                    }) => {
  // 按钮登录
  function handleOk() {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      dispatch({ type: 'logins/login', payload: values });
    });
  }

  // 回车登录
  function handleOks(event) {
    if (event.keyCode === 13) {
      validateFieldsAndScroll((errors, values) => {
        if (errors) {
          return;
        }
        dispatch({ type: 'logins/login', payload: values });
      });
    }
  }

  return (
    <Form className={styles.loginForm} onKeyDown={handleOks}>
      <FormItem>
        {getFieldDecorator('loginName', {
          rules: [{ required: true, message: '请输入用户名!', whitespace: true }],
        })(
          <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />,
        )}
      </FormItem>
      <FormItem>
        {getFieldDecorator('pwd', {
          rules: [{ required: true, message: '请输入密码!', whitespace: true }],
        })(
          <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />,
        )}
      </FormItem>
      {/* <FormItem>*/}
      {/* <Input type="code" placeholder="验证码" style={{width: 80}}/>*/}
      {/* <a className={styles.loginCode} href="">看不清楚？点击更换</a>*/}
      {/* </FormItem>*/}
      <FormItem>
        <Checkbox>记住我</Checkbox>
        {/* <a className={styles.loginForgot} href="">忘记密码？</a>*/}
        <Button type="primary" onClick={handleOk}>
          登录
        </Button>
      </FormItem>

    </Form>
  );
};

LoginModel.propTypes = {
  form: PropTypes.object,
  login: PropTypes.object,        /* eslint react/no-unused-prop-types: [0] */
  dispatch: PropTypes.func,
};

export default connect(({ login }) => ({ login }))(Form.create()(LoginModel));

