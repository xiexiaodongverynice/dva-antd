/**
 * Created by xinli on 06/06/2017.
 */
import React from 'react';
import { hashHistory } from 'dva/router';
import { Button, Form, Input } from 'antd';
import styles from './form.less';

const FormItem = Form.Item;

class LayoutAssignForm extends React.Component {

  okHandler = (oldValue) => {
    const { dispatch } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({ type: 'layout_assign/createOrUpdate', payload: { ...oldValue, ...values } });
      }
    });
  };
  goBack = () => {
    hashHistory.push('/layout_assign/list');
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const { layoutAssign } = this.props;
    const { id } = layoutAssign;

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

    const formItems = [{
      label: 'API_NAME',
      field: 'api_name',
      placeHolder: '不可重复, 仅支持字母，数字和下划线[a-zA-Z]',
      notEditable: true,
    }, {
      label: '业务对象api_name',
      field: 'object_describe_api_name',
      placeHolder: '可从对象与字段中查看',
    }, {
      label: '记录类型',
      field: 'record_type',
    }, {
      label: '布局类型',
      field: 'layout_type',
      placeHolder: 'index_page, detail_page, lookup_page',
    }, {
      label: '简档',
      field: 'profile',
      placeHolder: '可从简档列表中查看',
    },{
      label: '简档API_NAME',
      field: 'profile_api_name',
      placeHolder: '可从简档列表中查看',
    }, {
      label: '布局api_name',
      field: 'layout_api_name',
      placeHolder: '可从布局列表中查看',
    }, {
      label: '布局名称',
      field: 'layout_name',
    }].map(x => (
      <FormItem
        {...formItemLayout}
        key={`form-item-${x.field}`}
        label={x.label}
        hasFeedback
      >
        {getFieldDecorator(x.field, {
          initialValue: layoutAssign[x.field],
          rules: [{ required: true, message: `请输入${x.label}!`, whitespace: true }],
        })(
          <Input placeholder={x.placeHolder || ''} disabled={id && x.notEditable} />,
        )}
      </FormItem>
    ));

    return (
      <div>
        <h3 className={styles.myH3}>{id ? '修改布局分配' : '新建布局分配'}</h3>
        <Form>
          {formItems}
          <FormItem
            wrapperCol={{ span: 12, offset: 8 }}
          >
            <Button className={styles.buttonStyle} type="primary" onClick={this.okHandler.bind(this, layoutAssign)}>保存</Button>
            <Button className={styles.buttonStyle} onClick={this.goBack}>返回</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(LayoutAssignForm);
