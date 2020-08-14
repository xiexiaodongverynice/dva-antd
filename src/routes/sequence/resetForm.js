/**
 * Created by xinli on 06/06/2017.
 */
import React from 'react';
import { hashHistory } from 'dva/router';
import { Button, Form, Input, InputNumber } from 'antd';
import styles from './form.less';

const FormItem = Form.Item;


class SequenceResetForm extends React.Component {

  componentWillMount() {
  }

  okHandler = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.current_value !== values.reset_value) {
          this.props.dispatch({
            type: 'sequence/resetSequence',
            payload: {
              api_name: this.props.sequence.api_name,
              reset_value: values.reset_value,
              id: this.props.sequence.id,
            },
          });
        }
      }
    });
  };
  goBack = () => {
    hashHistory.push('/sequence');
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { label, current_value } = this.props.sequence;
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
    return (
      <div>
        <h3 className={styles.myH3}>重置序列</h3>
        <Form>
          <FormItem
            {...formItemLayout}
            label="名称"
            hasFeedback
          >
            {getFieldDecorator('label', {
              initialValue: label,
              rules: [{ required: false, message: '', whitespace: true }],
            })(
              <Input disabled />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="当前值"
            hasFeedback
          >
            {getFieldDecorator('current_value', {
              initialValue: current_value,
            })(
              <Input disabled />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="重置为"
            hasFeedback
          >
            {getFieldDecorator('reset_value', {
            })(
              <InputNumber />,
            )}
          </FormItem>
          <FormItem
            wrapperCol={{ span: 12, offset: 8 }}
          >
            <Button className={styles.buttonStyle} type="primary" onClick={this.okHandler}>保存</Button>
            <Button className={styles.buttonStyle} onClick={this.goBack}>返回列表</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(SequenceResetForm);
