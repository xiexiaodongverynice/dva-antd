/**
 * Created by xinli on 06/06/2017.
 */
import React from 'react';
import { hashHistory } from 'dva/router';
import _ from 'lodash';
import { Button, Form, Input, InputNumber, Select } from 'antd';
import styles from './form.less';
import * as objectDescribeService from '../../services/customObjects';

const FormItem = Form.Item;

const SEQUENCE_ADD = '/sequence/add';
const SEQUENCE_EDIT = '/sequence/edit';

class SequenceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objects: [],
      recordTypes: [],
    };
  }

  componentWillMount() {
    if (this.props.location.pathname === SEQUENCE_ADD) {
      this.setState({
        state_max_value: 9999,
        state_min_value: 1,
        state_start_value: 1,
      });
    }

    objectDescribeService.fetch({ page: 1 }).then((response) => {
      const objects = response.data;
      this.setState({
        objects,
      });
    });
  }

  onObjectSelect = (value) => {
    this.fetchRecordTypes(value);
  };

  onRecordTypeSelect = () => {};

  /**
   * 根据对象获取记录类型
   */
  fetchRecordTypes = async (value) => {
    const response = await objectDescribeService.fetchByApiName(
      {
        object_api_name: value,
      },
      false,
    );
    if (_.get(response, 'data')) {
      const result = _.get(response, 'data.record_types', []);
      this.setState({
        recordTypes: _.uniq([...result, 'master']),
      });
    }
  };

  ObjectSelector = (getFieldDecorator, isEditMode) => {
    const { objects } = this.state;
    const { object_describe_name } = this.props.sequence;
    const options = objects.map(x => (
      <Select.Option key={`obj-${x.api_name}`} value={x.api_name}>
        {x.display_name}
      </Select.Option>
    ));
    return getFieldDecorator('object_describe_name', {
      initialValue: isEditMode ? object_describe_name : '',
      rules: [{ required: true, message: '请选择对象！' }],
    })(
      <Select
        // placeholder="请选择对象"
        style={{ minWidth: 150 }}
        onChange={this.onObjectSelect}
        showSearch
        optionFilterProp="children"
        disabled={isEditMode}
        getPopupContainer={triggerNode => triggerNode.parentElement}
      >
        {options}
      </Select>,
    );
  };

  RecordTypeSelector = (getFieldDecorator, isEditMode) => {
    const { recordTypes } = this.state;
    const { record_type_name } = this.props.sequence;
    const options = recordTypes.map(x => (
      <Select.Option key={`obj-${x}`} value={x}>
        {x}
      </Select.Option>
    ));
    return getFieldDecorator('record_type_name', {
      initialValue: isEditMode ? record_type_name : '',
      rules: [{ required: true, message: '请选择记录类型！' }],
    })(
      <Select
        // placeholder="请选择记录类型"
        style={{ minWidth: 150 }}
        // onChange={this.onRecordTypeSelect}
        showSearch
        optionFilterProp="children"
        disabled={isEditMode}
        getPopupContainer={triggerNode => triggerNode.parentElement}
      >
        {options}
      </Select>,
    );
  };

  okHandler = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.props.location.pathname === SEQUENCE_ADD) {
          this.props.dispatch({ type: 'sequence/create', payload: values });
        }
        if (this.props.location.pathname === SEQUENCE_EDIT) {
          for (const k in values) {
            this.props.sequence[k] = values[k];
          }
          this.props.dispatch({ type: 'sequence/updateSequence', payload: { sequence: this.props.sequence } });
        }
      }
    });
  };

  goBack = () => {
    hashHistory.push('/sequence');
  };

  handlestart_valueValidator = (rule, val, callback) => {
    if (val > this.state.state_max_value || val < this.state.state_min_value) {
      callback('请于最大最小值之间正确输入初始值');
    }
    callback();
  };

  handlemax_valueValidator = (rule, val, callback) => {
    if (val < this.state.state_start_value || val < this.state.state_min_value) {
      callback('最大值不可以小于最小值或者初始值');
    }
    callback();
  };

  handlemin_valueValidator = (rule, val, callback) => {
    if (val > this.state.state_start_value || val > this.state.state_max_value) {
      callback('最小值不可以大于最大值或者初始值');
    }
    callback();
  };

  max_valueonChange = (value) => {
    this.setState({ state_max_value: value });
  };

  min_valueonChange = (value) => {
    this.setState({ state_min_value: value });
  };

  start_valueonChange = (value) => {
    this.setState({ state_start_value: value });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { label, api_name, min_value, max_value, start_value, increment, description } = this.props.sequence;
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
    const isEditMode = this.props.location.pathname === SEQUENCE_EDIT;
    const api_namepatten = '[a-zA-Z]\\w*';
    return (
      <div>
        <h3 className={styles.myH3}>{isEditMode ? '修改序列' : '新建序列'}</h3>
        <Form>
          <FormItem {...formItemLayout} label="名称" hasFeedback>
            {getFieldDecorator('label', {
              initialValue: isEditMode ? label : '',
              rules: [{ required: true, message: '请输入名称!', whitespace: true }],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="API_NAME" hasFeedback>
            {getFieldDecorator('api_name', {
              initialValue: isEditMode ? api_name : '',
              rules: [
                { required: true, message: '请输入API Name!', whitespace: true },
                { pattern: new RegExp(api_namepatten), message: '请输入正确的API Name格式' },
              ],
            })(<Input disabled={isEditMode} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="对象：" hasFeedback>
            {this.ObjectSelector(getFieldDecorator, isEditMode)}
          </FormItem>
          <FormItem {...formItemLayout} label="记录类型：" hasFeedback>
            {this.RecordTypeSelector(getFieldDecorator, isEditMode)}
          </FormItem>
          <FormItem {...formItemLayout} label="最小值" hasFeedback>
            {getFieldDecorator('min_value', {
              initialValue: isEditMode ? min_value : 1,
              rules: [{ required: true, message: '请输入最小值!' }, { validator: this.handlemin_valueValidator }],
            })(<InputNumber disabled={isEditMode} onChange={this.min_valueonChange} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="最大值" hasFeedback>
            {getFieldDecorator('max_value', {
              initialValue: isEditMode ? max_value : 9999,
              rules: [{ required: true, message: '请输入最大值!' }, { validator: this.handlemax_valueValidator }],
            })(<InputNumber disabled={isEditMode} onChange={this.max_valueonChange} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="起始值" hasFeedback>
            {getFieldDecorator('start_value', {
              initialValue: isEditMode ? start_value : 1,
              rules: [{ required: true, message: '请输入起始值!' }, { validator: this.handlestart_valueValidator }],
            })(<InputNumber disabled={isEditMode} onChange={this.start_valueonChange} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="增长步长" hasFeedback>
            {getFieldDecorator('increment', {
              initialValue: isEditMode ? increment : 1,
              rules: [{ required: true, message: '请输入增长步长!' }],
            })(<InputNumber disabled={isEditMode} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="描述" hasFeedback>
            {getFieldDecorator('description', {
              initialValue: description,
              rules: [{ required: false, message: '' }],
            })(<Input.TextArea rows={2} />)}
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

export default Form.create()(SequenceForm);
