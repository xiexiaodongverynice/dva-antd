/* eslint-disable no-undef */
import React from 'react';
import { connect } from 'dva';
import { hashHistory } from 'dva/router';
import { Form, Input, Row, Col, Button } from 'antd';
import LayoutView from '../../components/layout/layoutView';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

const CopyLayout  = ({ dispatch, form, layout, temp }) => {

  const { getFieldDecorator } = form;
  const { api_name, display_name } = temp;

  // 19/01/2018 - TAG: 创建布局
  const onSave = () => {
    dispatch({
      type: 'copyLayout/create',
      payload: layout,
    })
  }

  // 点击取消跳转
  const goBack = () => {
    hashHistory.push('/layouts/list');
  }

  return (
    <div>
      <Row>
        <Col span={6}>
          <Form style={{marginTop: 50}}>
            <FormItem
              {...formItemLayout}
              label="布局名称"
              hasFeedback
            >
              {getFieldDecorator('display_name', {
                initialValue: display_name,
                rules: [{ required: true, message: '请输入布局名称!', whitespace: true }],
              })(
                <Input />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="API_NAME"
              hasFeedback
            >
              {getFieldDecorator('api_name', {
                initialValue: api_name,
                rules: [{ required: true, message: '请输入API_NAME!', whitespace: true }],
              })(
                <Input />,
              )}
            </FormItem>
          </Form>

          <Row justify="center" type="flex">
            <Button className="ant-btn-primary" onClick={onSave} > 保存 </Button>
            <Button className="ant-btn-primary" onClick={goBack} style={{marginLeft: 10}}> 取消 </Button>
          </Row>
        </Col>
        <Col span={18}>
          <LayoutView layout={layout} dispatch={dispatch} />
        </Col>
      </Row>
    </div>
  );
}

function mapStateToProps(state) {
  const { layout, temp } = state.copyLayout;
  const loading = state.loading.models.copyLayout;
  return {
    temp,
    layout,
    loading,
  };
}

export default connect(mapStateToProps)(Form.create({
  onValuesChange: (props, values) => {
    const { dispatch } = props;
    dispatch({
      type: 'copyLayout/updateTemp',
      payload: values,
    });
  },
})(CopyLayout));
