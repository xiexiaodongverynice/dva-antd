/**
 * Created by Administrator on 2017/5/25 0025.
 *
 * !!!!!!!!!!!!!!看不懂,不会改orz!!!!!!!!!!!!!!!
 */
import { Form, Input, Icon, Button, Row, Col } from 'antd';
import React from 'react';
import _ from 'lodash';
import styles from './DynamicFieldSet.css';

const FormItem = Form.Item;

export default class DynamicFieldSet extends React.Component {

  componentWillMount=() => {
    this.dealFormOptions();
  }

  onDeal = () => {
    this.props.form.validateFields((err) => {
      if (!err) {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        let options = [];
        keys.forEach((k, index) => {
          const val = form.getFieldValue(`value-${index}`);
          const lab = form.getFieldValue(`label-${index}`);
          const option = { value: val, label: lab };
          options = options.concat(option);
        });
        this.props.synOptions(options);
      }
    });
  };

  dealFormOptions=() => {
    const { form } = this.props;
    const { getFieldDecorator } = this.props.form;
    getFieldDecorator('keys', { initialValue: [] });
    const keys = form.getFieldValue('keys');      /* eslint no-unused-vars: [0] */
    const options = this.props.options === undefined ? [] : this.props.options;
    const keyNum = this.props.options === undefined ? 0 : this.props.options.length;

    for (let i = 0; i < keyNum; i++) {
      const nextKeys = form.getFieldValue('keys').concat(i);
      form.setFieldsValue({
        keys: nextKeys,
      });
    }
    form.getFieldValue('keys').forEach((k, index) => {
      getFieldDecorator(`value-${k}`, { initialValue: options[index].value });
      getFieldDecorator(`label-${k}`, { initialValue: options[index].label });
    });
  }

  add = () => {
    const { form } = this.props;
    const options = this.props.options === undefined ? [] : this.props.options; /* eslint no-unused-vars: [0] */
    const keyNum = this.props.options === undefined ? 0 : this.props.options.length;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(keyNum + 1);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  remove = (index) => {
    const { form, options } = this.props;
    const { getFieldDecorator } = this.props.form;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }
    options.splice(index, 1);
    keys.splice(index, 1);
    form.setFieldsValue({
      keys,
    });
    this.props.synOptions(options);
    form.getFieldValue('keys').forEach((k, index) => {
      getFieldDecorator(`value-${index}`, { initialValue: options[index].value });
      getFieldDecorator(`label-${index}`, { initialValue: options[index].label });
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const keys = getFieldValue('keys');
    const { stylesParams } = this.props;
    const size = keys.length || 0;
    const disState = _.get(this.props, 'disabledstate', false);
    const formItems = keys.map((k, index) => {
      return (
        <Row
          gutter={16}
          size={size}
        >
          <Col span={stylesParams ? stylesParams.span : 12} offset={stylesParams ? stylesParams.offset : 0}>
            <FormItem span={16}>
              {getFieldDecorator(`value-${index}`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [{
                  required: true,
                  whitespace: true,
                  message: 'Please input the value of collection!',
                }],
              })(
                <Input placeholder="option value" style={{ width: '100%' }} onBlur={this.onDeal} disabled={disState} />,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem span={16}>
              {getFieldDecorator(`label-${index}`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [{
                  required: true,
                  whitespace: true,
                  message: 'Please input the label of collection!',
                }],
              })(
                <Input placeholder="option label" style={{ width: '60%', marginRight: 8 }} onBlur={this.onDeal} disabled={disState} />,
              )}
              {
                !disState && (
                  <span>
                    <Icon
                      className={styles.dynamicDeleteButton}
                      type="plus-circle-o"
                      onClick={() => this.add()}
                    />
                    <Icon
                      className={styles.dynamicDeleteButton}
                      style={{ marginRight: 8 }}
                      type="minus-circle-o"
                      disabled={keys.length === 1}
                      onClick={() => this.remove(index)}
                    />
                  </span>
                )
              }
            </FormItem>
          </Col>
        </Row>
      );
    });
    return (
      <div>
        {formItems}
        <Button type="dashed" onClick={this.add} style={stylesParams ? stylesParams.style : { width: '100%' }} disabled={disState}>
          <Icon type="plus" /> Add field
        </Button>
      </div>
    );
  }
}
