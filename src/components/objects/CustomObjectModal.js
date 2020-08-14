import React, { Component } from 'react';
import _ from 'lodash';
import {
  Modal, Form, Select, Radio, Button, Input,
} from 'antd';
import EditableTagGroup from '../common/editableTagGroup';

const FormItem = Form.Item;
const Option = Select.Option;

class CustomObjectEditModal extends Component {
  constructor(props) {
    super(props);
    // const {viewState} = props;
    // console.log("viewState:"+viewState);
    this.state = {
      visible: false,
      newKey: new Date(),
      disState: false,
      editDisState: false,
      // recordTypes: this.props.record.record_types || [],
    };
  }
  componentWillMount = () => {
    // this.dealViewState();
  }

  componentDidMount = () => {
    this.dealViewState();
  }

  showModalHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  okHandler = () => {
    const { onOk } = this.props;
    // const {viewState} = this.props;
    // console.log("viewState:"+viewState);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.version = this.props.record.version;
        // values['record_types'] = this.state.recordTypes;
        console.log(values);
        onOk(values);
        this.hideModelHandler();
      }
    });
  };

  dealViewState = () => {
    const { viewState } = this.props;
    // console.log("viewState:"+viewState);
    if (viewState === 'add') {
      this.setState({
        disState: false,
        editDisState: false,
      });
    } else if (viewState === 'edit') {
      this.setState({
        disState: false,
        editDisState: true,
      });
    } else if (viewState === 'view') {
      this.setState({
        disState: true,
      });
    }
  };

  render() {
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;

    const { display_name, api_name, define_type, is_active, is_name_unique, description, record_types, global_authority } = this.props.record;
    // console.log("htmlPackage:"+htmlPackage);
    // const {viewState} = this.props;
    // this.dealViewState();
    const formItemLayout = {
      /**/
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <span>
        <span onClick={this.showModalHandler}>
          { children }
        </span>
        <Modal
          title={this.props.mode === 'new' ? '新建业务对象' : '编辑业务对象'}
          key={this.state.newKey}
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
          maskClosable={false}
          footer={[
            <Button key="back" size="large" onClick={this.hideModelHandler}>返回</Button>,
            <Button key="submit" type="primary" size="large" onClick={this.okHandler} disabled={this.state.disState}>
              提交
            </Button>,
          ]}
        >
          <Form horizontal onSubmit={this.okHandler}>

            <FormItem
              {...formItemLayout}
              label="API名称"
            >
              {
                getFieldDecorator('api_name', {
                  initialValue: api_name,
                  rules: [{ required: true, message: '请输入API名称!' }],
                })(<Input disabled={this.state.disState || this.state.editDisState} />)
              }
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="对象名称"
            >
              {
                getFieldDecorator('display_name', {
                  initialValue: display_name,
                  rules: [{ required: true, message: '请输入对象名称!' }],
                })(<Input disabled={this.state.disState} />)
              }
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="包名"
            >
              {
                getFieldDecorator('package', {
                  initialValue: this.props.record.package,
                  rules: [{ required: true, message: '请输入包名' }],
                })(<Input disabled={this.state.disState} />)
              }
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="表名"
            >
              {
                getFieldDecorator('table_name', {
                  initialValue: this.props.record.table_name,
                  rules: [{ required: true, message: '请输入表名' }],
                })(<Input disabled={this.state.disState || this.state.editDisState} placeholder="表名一经保存，不可修改，只支持英文、下划线" />)
              }
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="定义类型"
            >
              {
                   getFieldDecorator('define_type', {
                     initialValue: define_type,
                     rules: [{ required: true, message: '请选择定义类型！' }],
                   })(
                     <Select placeholder="Please select one field type" disabled={this.state.disState} >
                       <Option value="system">system </Option>
                       <Option value="package">package</Option>
                       <Option value="custom">custom</Option>
                     </Select>,
                   )
                 }
            </FormItem>

            <FormItem
              className="collection-create-form_last-form-item"
              {...formItemLayout} label="是否启用"
            >
              {getFieldDecorator('is_active', {
                initialValue: is_active === undefined ? true : is_active,
                rules: [{ required: true, message: '请选择是否启用' }],
              })(
                <Radio.Group disabled={this.state.disState} >
                  <Radio value >是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>,
                  )}
            </FormItem>
            <FormItem
              className="collection-create-form_last-form-item"
              {...formItemLayout} label="name是否唯一"
            >
              {getFieldDecorator('is_name_unique', {
                initialValue: is_name_unique === undefined ? false : is_name_unique,
                rules: [{ required: true, message: '请指定名称字段是否唯一' }],
              })(
                <Radio.Group disabled={this.state.disState} >
                  <Radio value >是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>,
                  )}
            </FormItem>
            <FormItem
              className="collection-create-form_last-form-item"
              {...formItemLayout} label="记录类型"
            >
              {getFieldDecorator('record_types', {
                initialValue: record_types || [],
              })(
                <EditableTagGroup
                  inputVisible={false}
                  inputValue=""
                  defaultDisable={this.state.disState}
                />,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="对象数据权限"
            >
              {
                getFieldDecorator('global_authority', {
                  initialValue: global_authority || 8,
                  rules: [{ required: true, message: '请选择定义类型！' }],
                })(
                  <Select placeholder="Please select one field type" disabled={this.state.disState} >
                    <Option value={1}>公开读写</Option>
                    <Option value={2}>完全私有 </Option>
                    <Option value={4}>岗位私有</Option>
                    <Option value={8}>公开只读</Option>
                  </Select>,
                )
              }
            </FormItem>

            <FormItem
              {...formItemLayout} label="是否授权给层级架构"
            >
              {getFieldDecorator('is_authorize', {
                initialValue: _.get(this.props.record, 'is_authorize', false),
                rules: [{ required: true, message: '请指定是否授权给层级架构' }],
              })(
                <Radio.Group disabled={this.state.disState} >
                  <Radio value >是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>,
              )}
            </FormItem>

            <FormItem
              className="collection-create-form_last-form-item"
              {...formItemLayout} label="是否启用审批流"
            >
              {getFieldDecorator('enable_approval_flow', {
                initialValue: _.get(this.props.record, 'enable_approval_flow', false),
                rules: [{ required: true, message: '请指定是否授权给层级架构' }],
              })(
                <Radio.Group disabled={this.state.disState} >
                  <Radio value >是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>,
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="描述"
            >
              {
                getFieldDecorator('description', {
                  initialValue: description,
                  rules: [{ required: false, message: '请输入对象描述！' }],
                })(<Input type="textarea" rows={4} disabled={this.state.disState} />)
              }
            </FormItem>

          </Form>

        </Modal>
      </span>
    );
  }
}

export default Form.create()(CustomObjectEditModal);

