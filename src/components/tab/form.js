/**
 * Created by xinli on 06/06/2017.
 */
import React from 'react';
import { hashHistory } from 'dva/router';
import _ from 'lodash';
import { Button, Form, Input, Select, InputNumber } from 'antd';
import SelectIconView from './SelectIconView';
import styles from './form.less';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

const TAB_ADD = '/tabs/add';
const TAB_EDIT = '/tabs/edit';

class TabForm extends React.Component {
  constructor(props) {
    super(props);
    const { tab } = props;
    this.state = {
      tabType: tab.type || 'object_index',
    };
  }

  componentWillMount() {}

  onObjectSelectChange = (value) => {
    this.props.dispatch({
      type: 'nav_tabs/changeSelectedObjectDescribe',
      payload: {
        selectedObjectApiName: value,
      },
    });
  };

  onTabTypeChange = (value) => {
    this.setState({
      tabType: value,
    });
  };

  okHandler = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.props.location.pathname === TAB_ADD) {
          this.props.dispatch({ type: 'nav_tabs/create', payload: { ...values, define_type: 'custom' } });
        }
        if (this.props.location.pathname === TAB_EDIT) {
          const tabData = _.assign({}, this.props.tab);
          for (const k in values) {
            tabData[k] = values[k];
          }

          this.props.dispatch({ type: 'nav_tabs/updateTab', payload: { tab: tabData } });
        }
      }
    });
  };
  goBack = () => {
    hashHistory.push('/tabs');
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      label,
      api_name,
      object_describe_api_name,
      type,
      record_type,
      display_order,
      hidden_devices,
      external_page_src,
      internal_page_src,
      external_page_param,
      param_encryption,
      show_app,
      tabIcon,
      define_type = 'custom',
    } = this.props.tab;

    const { customObjects, selectedObjectApiName } = this.props;
    const Option = Select.Option;
    const objectOptions = customObjects.map((object) => (
      <Option key={object.id} value={object.api_name}>
        {object.display_name}
      </Option>
    ));
    const selectedObjectDescribe = customObjects.find((x) => x.api_name === selectedObjectApiName) || {};
    const recordTypeOptions = _.uniq([..._.get(selectedObjectDescribe, 'record_types', []), 'master']).map((op) => (
      <Option key={op} value={op}>
        {op}
      </Option>
    ));
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
    const isEditMode = this.props.location.pathname === TAB_EDIT;
    const isSystemMode = define_type == 'system';
    const hidden_devices_options = [
      { label: 'Web', value: 'PC' },
      { label: '平板', value: 'tablet' },
      { label: '手机', value: 'cellphone' },
    ].map((x) => (
      <Option key={`hdp_opt_${x.value}`} value={x.value}>
        {x.label}
      </Option>
    ));

    const show_app_options = [
      { label: 'CRM', value: 'CRM' },
      { label: 'IC', value: 'IC' },
      { label: 'TQ', value: 'TQ' },
      { label: 'DI', value: 'DI' },
    ].map((x) => (
      <Option key={`show_app_opt_${x.value}`} value={x.value}>
        {x.label}
      </Option>
    ));

    const tabType = isEditMode ? type : this.state.tabType;

    const getFieldItems = (tabType, isSystemMode = false) => {
      if (tabType === 'object_index') {
        return (
          <div>
            <FormItem {...formItemLayout} label="业务对象" hasFeedback>
              {getFieldDecorator('object_describe_api_name', {
                initialValue: object_describe_api_name,
                rules: [{ required: tabType === 'object_index', message: '请选择业务对象' }],
              })(
                <Select
                  placeholder="请选择业务对象"
                  onChange={this.onObjectSelectChange}
                  disabled={isSystemMode}
                  showSearch
                  optionFilterProp="children"
                >
                  {objectOptions}
                </Select>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="记录类型" hasFeedback>
              {getFieldDecorator('record_type', {
                initialValue: record_type,
              })(
                <Select placeholder="" disabled={isSystemMode}>
                  {recordTypeOptions}
                </Select>,
              )}
            </FormItem>
          </div>
        );
      } else if (tabType === 'external_page') {
        return (
          <div>
            <FormItem {...formItemLayout} label="外部页面地址" hasFeedback>
              {getFieldDecorator('external_page_src', {
                initialValue: external_page_src,
                rules: [{ required: true, message: '请输入外部页面地址' }],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="参数" hasFeedback>
              {getFieldDecorator('external_page_param', {
                initialValue: external_page_param,
                rules: [],
              })(<TextArea rows={4} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="参数编码方式" hasFeedback>
              {getFieldDecorator('param_encryption', {
                initialValue: param_encryption,
                rules: [],
              })(
                <Select disabled={isSystemMode}>
                  <Option value="none">明文(不进行编码)</Option>
                  <Option value="base64">BASE64</Option>
                </Select>,
              )}
            </FormItem>
          </div>
        );
      } else if (tabType === 'internal_page') {
        return (
          <div>
            <FormItem {...formItemLayout} label="内部页面地址" hasFeedback>
              {getFieldDecorator('internal_page_src', {
                initialValue: internal_page_src,
                rules: [{ required: true, message: '请输入内部页面地址' }],
              })(<Input disabled={isSystemMode} />)}
            </FormItem>
          </div>
        );
      }
    };

    return (
      <div>
        <h3 className={styles.myH3}>{isEditMode ? '修改菜单' : '新建菜单'}</h3>
        <Form>
          <FormItem {...formItemLayout} label="名称" hasFeedback>
            {getFieldDecorator('label', {
              initialValue: label,
              rules: [{ required: true, message: '请输入名称!', whitespace: true }],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="API_NAME" hasFeedback>
            {getFieldDecorator('api_name', {
              initialValue: api_name,
              rules: [{ required: true, message: '请输入名称!', whitespace: true }],
            })(<Input disabled={isEditMode || isSystemMode} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="菜单类型" hasFeedback>
            {getFieldDecorator('type', {
              initialValue: type,
              rules: [{ required: true, message: '请选择菜单类型!', whitespace: true }],
            })(
              <Select disabled={isEditMode || isSystemMode} onChange={this.onTabTypeChange}>
                <Option value="sub_menu">菜单展示项</Option>
                <Option value="object_index">对象数据列表</Option>
                <Option value="external_page">外部页面</Option>
                <Option value="internal_page">内部页面</Option>
              </Select>,
            )}
          </FormItem>
          {getFieldItems(tabType, isSystemMode)}
          <FormItem {...formItemLayout} label="显示顺序" hasFeedback>
            {getFieldDecorator('display_order', {
              initialValue: display_order || 0,
            })(<InputNumber />)}
          </FormItem>
          <FormItem {...formItemLayout} label="特定设备上不显示" hasFeedback>
            {getFieldDecorator('hidden_devices', {
              initialValue: hidden_devices || [],
            })(<Select mode="multiple">{hidden_devices_options}</Select>)}
          </FormItem>
          <FormItem {...formItemLayout} label="显示应用" hasFeedback>
            {getFieldDecorator('show_app', {
              initialValue: show_app || [],
            })(<Select mode="multiple">{show_app_options}</Select>)}
          </FormItem>
          <FormItem {...formItemLayout} label="CRM手机端菜单ICON">
            {getFieldDecorator('tabIcon', {
              initialValue: tabIcon || {},
            })(<SelectIconView />)}
          </FormItem>

          <FormItem wrapperCol={{ span: 12, offset: 8 }}>
            <Button className={styles.buttonStyle} type="primary" onClick={this.okHandler}>
              保存
            </Button>
            <Button className={styles.buttonStyle} onClick={this.goBack}>
              返回列表
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(TabForm);
