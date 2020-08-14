/**
 * Created by xinli on 06/06/2017.
 */
import React from 'react';
import { hashHistory } from 'dva/router';
import { Form, Input } from 'antd';
import styles from './detail.less';

export default class RecordDetail extends React.Component {
  state = {
    value: undefined,
  };
  onChange = (value) => {
    this.setState({ value });
  };

  goBack = () => {
    hashHistory.push('/tabs');
  };

  render() {
    const FormItem = Form.Item;
    const { describe, record } = this.props;
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

    const formItems = describe.fields.map(field =>
      <FormItem
        {...formItemLayout}
        label={field.label}
        key={field.api_name}
      >
        <Input value={record[field.api_name]} readOnly />
      </FormItem>,
    );

    return (

      <div>
        <h3 className={styles.myH3}>{this.props.describe.display_name}详情</h3>
        <Form>
          {
            formItems
          }
        </Form>
      </div>
    );
  }
}
