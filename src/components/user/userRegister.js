import React from 'react';
import { Link } from 'react-router';
import { Form, Input, Select, Button, Radio } from 'antd';
import UserSelector from './UserSelector';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class UserRegister extends React.Component {
  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({ type: 'register/register', payload: { oper: this.props.oper, obj: values } });
      }
    });
  }
  handleSaveAndCreate = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({ type: 'register/registerAndCreate', payload: { oper: this.props.oper, obj: values } });
      }
    });
  }

  handleChange = (e) => {
    this.props.form.setFieldsValue({ enable: e.target.checked });
  }

  render() {
    /* console.log(this.props.body)
    console.log(this.props.proList);
    console.log(this.props.roleList);
    console.log(this.props.dutyList);
    console.log(this.props.deptList);*/
    // 简档
    const list1 = this.props.proList;
    const profileChildren = list1.map((pro) => {
      return (<Option value={`${pro.id}`} key={pro.id}>{pro.name}</Option>);
    });


    // 角色
    const list2 = this.props.roleList;
    const roleChildren = list2.map((pro) => {
      return (<Option value={`${pro.id}`} key={pro.id}>{pro.name}</Option>);
    });

    // 职务
    const list3 = this.props.dutyList;
    const dutyChildren = list3.map((pro) => {
      return (<Option value={`${pro.id}`} key={pro.id}>{pro.name}</Option>);
    });

    // 部门
    const list4 = this.props.deptList;
    const deptChildren = list4.map((pro) => {
      return (<Option value={`${pro.id}`} key={pro.id}>{pro.name}</Option>);
    });

    const { getFieldDecorator } = this.props.form;
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
    const register_container = { width: '100%', margin: '-20px auto' };
    const register_form_ul = { width: '1000px', margin: '0 auto' };
    const register_form_ul_li = { float: 'left', width: '49%', padding: '2%' };
    const register_div = { width: '400px', margin: '0 auto', clear: 'both' };
    const register_btn = { margin: '10px 10px' };
    const register_bar = { width: '100%', height: '42px', backgroundColor: '#ececec', clear: 'both' };

    return (
      <div style={register_container}>
        <div style={register_div}>
          <Button type="primary" onClick={this.handleSave} style={register_btn}>保存</Button>
          <Button type="primary" onClick={this.handleSaveAndCreate} style={register_btn}>保存并新建</Button>
          <Link to={'/user'}><Button type="primary" style={register_btn}>取消</Button></Link>
        </div>
        <div style={register_bar} />
        <Form>
          <ul style={register_form_ul}>
            <li style={register_form_ul_li}>
              <FormItem label="登录账号" {...formItemLayout}>
                {getFieldDecorator('account', {
                  initialValue: this.props.body.account,
                  rules: [{ required: true, message: '请输入登录账号!' }],
                })(
                  this.props.oper == 'edit' && this.props.body.enable === true ? <Input disabled/> : <Input />,
                )}
              </FormItem>
              <FormItem label="用户名" {...formItemLayout}>
                {getFieldDecorator('name', {
                  initialValue: this.props.body.name,
                  rules: [{ required: true, message: '请输入用户名!' }],
                })(
                  <Input />,
                )}
              </FormItem>
              <FormItem label="电子邮件" {...formItemLayout}>
                {getFieldDecorator('email', {
                  initialValue: this.props.body.email,
                  rules: [{ type: 'email', required: true, message: '请输入邮件地址!' }],
                })(
                  <Input />,
                )}
              </FormItem>
              <FormItem label="昵称" {...formItemLayout}>
                {getFieldDecorator('nick_name', {
                  initialValue: this.props.body.nick_name,
                  rules: [{ required: true, message: '请输入昵称' }],
                })(
                  <Input />,
                )}
              </FormItem>
              <FormItem label="性别：" {...formItemLayout}>
                {getFieldDecorator('gender', {
                  initialValue: this.props.body.gender,
                })(
                  <RadioGroup>
                    <Radio value="男">男</Radio>
                    <Radio value="女">女</Radio>
                  </RadioGroup>,
                )}
              </FormItem>
              <FormItem label="职务" {...formItemLayout}>
                {getFieldDecorator('duty', {
                  initialValue: this.props.body.duty__r == undefined ? '' : this.props.body.duty__r.id.toString(),
                })(
                  <Select>
                    {dutyChildren}
                  </Select>,
                )}
              </FormItem>
              <FormItem label="部门" {...formItemLayout}>
                {getFieldDecorator('department', {
                  initialValue: this.props.body.department__r == undefined ? '' : this.props.body.department__r.id.toString(),
                })(
                  <Select>
                    {deptChildren}
                  </Select>,
                )}
              </FormItem>
              <FormItem label="员工编号" {...formItemLayout}>
                {getFieldDecorator('employee_number', {
                  initialValue: this.props.body.employee_number,
                })(
                  <Input />,
                )}
              </FormItem>
            </li>
            <li style={register_form_ul_li}>
              <FormItem label="角色" {...formItemLayout}>
                {getFieldDecorator('role', {
                  initialValue: this.props.body.role__r == undefined ? '' : this.props.body.role__r.id.toString(),
                  rules: [{ required: true, message: '请选择角色!' }],
                })(
                  <Select>
                    {roleChildren}
                  </Select>,
                )}
              </FormItem>
              <FormItem label="简档" {...formItemLayout}>
                {getFieldDecorator('profile', {
                  initialValue: this.props.body.profile__r == undefined ? '' : this.props.body.profile__r.id.toString(),
                  rules: [{ required: true, message: '请选择简档!' }],
                })(
                  <Select>
                    {profileChildren}
                  </Select>,
                )}
              </FormItem>
              <FormItem label="虚线上级" {...formItemLayout}>
                {getFieldDecorator('dotted_line_manager', {
                  initialValue: this.props.body.dotted_line_manager,
                })(
                  <UserSelector defaultUser={this.props.body.dotted_line_manager__r} />,
                )}
              </FormItem>
              <FormItem label="电话：" {...formItemLayout}>
                {getFieldDecorator('phone', {
                  initialValue: this.props.body.phone,
                })(
                  <Input />,
                )}
              </FormItem>
              <FormItem label="分机" {...formItemLayout}>
                {getFieldDecorator('extension', {
                  initialValue: this.props.body.extension,
                })(
                  <Input />,
                )}
              </FormItem>
              <FormItem label="传真" {...formItemLayout}>
                {getFieldDecorator('fax', {
                  initialValue: this.props.body.fax,
                })(
                  <Input />,
                )}
              </FormItem>
              <FormItem label="手机" {...formItemLayout}>
                {getFieldDecorator('telephone', {
                  initialValue: this.props.body.telephone,
                })(
                  <Input />,
                )}
              </FormItem>
              <FormItem label="外部ID" {...formItemLayout}>
                {getFieldDecorator('external_id', {
                  initialValue: this.props.body.external_id,
                  rules: [{ required: false, message: '请输入外部ID!' }],
                })(
                  <Input />,
                )}
              </FormItem>
            </li>
          </ul>
          <div style={register_bar} />
          <ul style={register_form_ul}>
            <li style={register_form_ul_li}>
              <FormItem label="国家/地区" {...formItemLayout}>
                {getFieldDecorator('country', {
                  initialValue: this.props.body.country,
                })(
                  <Input />,
                )}
              </FormItem>
              <FormItem label="邮政编码" {...formItemLayout}>
                {getFieldDecorator('postcode', {
                  initialValue: this.props.body.postcode,
                })(
                  <Input />,
                )}
              </FormItem>
              <FormItem label="州/省" {...formItemLayout}>
                {getFieldDecorator('province', {
                  initialValue: this.props.body.province,
                })(
                  <Input />,
                )}
              </FormItem>
            </li>
            <li style={register_form_ul_li}>
              <FormItem label="城市" {...formItemLayout}>
                {getFieldDecorator('city', {
                  initialValue: this.props.body.city,
                })(
                  <Input />,
                )}
              </FormItem>
              <FormItem label="街道" {...formItemLayout}>
                {getFieldDecorator('street', {
                  initialValue: this.props.body.street,
                })(
                  <Input />,
                )}
              </FormItem>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('id', {
                  initialValue: this.props.body.id,
                })(
                  <Input type="hidden" />,
                )}
              </FormItem>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('version', {
                  initialValue: this.props.body.version,
                })(
                  <Input type="hidden" />,
                )}
              </FormItem>
            </li>
          </ul>
        </Form>
        <div style={register_div}>
          <Button type="primary" style={register_btn} onClick={this.handleSave}>保存</Button>
          <Button type="primary" style={register_btn} onClick={this.handleSaveAndCreate}>保存并新建</Button>
          <Link to={'/user'}><Button type="primary" style={register_btn}>取消</Button></Link>
        </div>
      </div>
    );
  }
}

export default Form.create()(UserRegister);
