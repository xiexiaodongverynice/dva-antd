import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Form, Input, Button, Checkbox, Select } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const profile_edit_ul = { width: '700px', marginTop: '20px' };
const profile_edit_li = { padding: '30px' };
const profile_edit_form = { width: '600px' };
const profile_edit_input = { width: '300px' };
const profile_edit_div = { width: '200px', margin: '0 auto' };
const profile_edit_btn = { margin: '10px 10px' };
const profile_edit_bar = { width: '100%', height: '42px', lineHeight: '42px', backgroundColor: '#ececec', clear: 'both' };
const profile_edit_span = { marginLeft: '20px' };

/* 编辑简档 */
const EditSimpleProfile = ({ form, data, proList, dispatch }) => {
  const { id, type, name, api_name, is_super_profile = false, external_id } = data;
  const is_copy = type === 'copy';

  // 提交
  const handleSubmit = (e) => {
    e.preventDefault();
    // 验证form表单
    form.validateFields((err, values) => {
      if (!err) {
        const payload = Object.assign({}, data, {
          name: values.name,
          id: null,
          api_name: values.api_name,
          external_id: values.external_id,
          is_super_profile: values.is_super_profile,
        });
        console.log('Received values of form: ', values);
        dispatch({
          type: 'editProfile/add',
          payload,
        });
      }
    });
  };

  // 监听表单内容变化并修改model
  const handleChange = (id) => {
    dispatch({
      type: 'editProfile/copy',
      payload: {
        id,
        type: 'add',
      },
    });
  };

  const { getFieldDecorator } = form;
  // 已有简档列表
  const child = proList.map((pro) => {
    return (<Option key={pro.id}>{pro.name}</Option>);
  });

  return (
    <div>
      <ul style={profile_edit_ul}>
        <li style={profile_edit_li}>
          <div style={profile_edit_bar}>
            <span style={profile_edit_span}>
              {
                is_copy ? '您必须选择一个要复制的现有简档' : '您可以选择一个现有的简档进行复制'
              }
            </span>
          </div>
        </li>
        <li>
          <div style={profile_edit_form}>
            <Form onSubmit={handleSubmit}>
              <FormItem label="现有简档" {...formItemLayout}>
                {getFieldDecorator('id', {
                  initialValue: id,
                  // rules: [{ required: true, message: '请选择现有简档' }],
                })(
                  is_copy
                    ? <span>{name}</span>
                    : <Select onChange={handleChange} style={profile_edit_input} >{child}</Select>,
                )}
              </FormItem>
              <FormItem label="简档名" {...formItemLayout}>
                {getFieldDecorator('name', {
                  initialValue: name,
                  rules: [{ required: true, message: '请输入简档名称' }],
                })(
                  <Input style={profile_edit_input} />,
                )}
              </FormItem>
              <FormItem label="API_NAME" {...formItemLayout}>
                {getFieldDecorator('api_name', {
                  initialValue: api_name,
                  rules: [{ required: true, message: '请输入API_NAME' }],
                })(
                  <Input style={profile_edit_input} />,
                )}
              </FormItem>
              <FormItem label="外部ID" {...formItemLayout}>
                {getFieldDecorator('external_id', {
                  initialValue: external_id,
                  rules: [{ required: true, message: '请输入外部ID' }],
                })(
                  <Input style={profile_edit_input} />,
                )}
              </FormItem>
              <FormItem label="是否超级管理员" {...formItemLayout}>
                {getFieldDecorator('is_super_profile', {
                  initialValue: is_super_profile,
                  rules: [{ required: false, message: '请输入API_NAME' }],
                })(
                  <Checkbox />,
                )}
              </FormItem>
            </Form>
          </div>
        </li>
        <li>
          <div style={profile_edit_div}>
            <Button type="primary" style={profile_edit_btn} onClick={handleSubmit}>保存</Button>
            <Link to={'/profile'}><Button type="primary" style={profile_edit_btn}>取消</Button></Link>
          </div>
        </li>
      </ul>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { editProfile } = state;
  const { data, proList } = editProfile;
  return {
    data,
    proList,
  };
};

export default connect(mapStateToProps)(Form.create()(EditSimpleProfile));
