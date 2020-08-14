import React, { Component } from 'react';
import _ from 'lodash';
import { Modal, Form, Select, Radio, Row, Col, Button, Input, InputNumber, Checkbox } from 'antd';
import DynamicFieldSet from './DynamicFieldSet';
import request from '../../utils/request_custom';
import config from '../../utils/config';

const CheckboxGroup = Checkbox.Group;

const { api } = config;
const { custom_objects_all, sequence } = api;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const formSepItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

class CustomFieldEditModal extends Component {
  state = {
    visible: false,
    digitalVisible: false,
    number: 1234,
    type: undefined,
    newKey: new Date(),
    disState: false,
    editDisState: false,
    targetObjects: [],
    currentValue: [],
    fetching: false,
    isVirtual: false,
    sequenceList: [],
    sequenceObjName: '',
    sequencerecordTypeName: '',
  };

  componentWillMount = () => {
    this.dealViewState();
  };

  dealViewState = () => {
    const { viewState } = this.props;
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
  showModalHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
    if (this.props.record.target_object_api_name !== undefined) {
      this.fetchObjectList();
    }
    if (this.props.record.type === 'auto_number') {
      this.fetchSequenceList();
    }
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  handleFormTypeChange = (typeVal) => {
    this.props.record.type = typeVal;
    this.setState({
      type: typeVal,
      sequenceObjName: '',
      sequencerecordTypeName: '',
    });
    if (typeVal === 'relation') {
      const targetObjects = _.get(this.state, 'targetObjects');
      if (_.isEmpty(targetObjects)) this.fetchObjectList();
    }
    if (typeVal === 'auto_number') {
      this.fetchSequenceList();
    }
  };

  handleIsVirtualChange = (event) => {
    const value = event.target.value;
    // 貌似并没有什么用
    this.props.record.is_virtual = value;

    this.setState({
      isVirtual: value,
    });
  };

  handleSequenceChange = (value) => {
    const { sequenceList } = this.state;
    const seq = _.find(sequenceList, (o) => {
      return o.api_name == value;
    });
    const sequenceObjName = _.get(seq, 'object_describe_name', '');
    const sequencerecordTypeName = _.get(seq, 'record_type_name', '');
    this.setState({
      sequenceObjName,
      sequencerecordTypeName,
    });
  };

  okHandler = () => {
    const { onOk } = this.props;
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        values.version = this.props.record.version;
        values.options = this.props.record.options;
        if (this.props.record.target_object_api_name !== undefined) {
          values.target_object_api_name = this.props.record.target_object_api_name.key;
        }
        values = this.cleanExtValues(values);
        onOk(values);
        this.hideModelHandler();
      }
    });
  };

  cleanExtValues = (values) => {
    // 用于编辑一个字段时，清除之前的多余属性;
    const record = this.props.record;
    const typeVal = this.props.record.type;
    const { sequenceObjName, sequencerecordTypeName } = this.state;
    if (typeVal !== 'text') {
      if (_.has(record, 'pattern')) {
        _.assign(values, { pattern: null });
        console.log('!== text(pattern: null)', values);
      }
      if (typeVal !== 'long_text') {
        if (_.has(record, 'min_length')) {
          _.assign(values, { min_length: null });
          console.log('!== long_text && !==text(min_length: null)', values);
        }
      }
    }
    if (typeVal !== 'real_number') {
      if (_.has(record, 'decimal_places')) {
        _.assign(values, { decimal_places: null });
        console.log('!==real_number(decimal_places: null)', values);
      }
    }
    if (typeVal !== 'big_int' && typeVal !== 'real_number' && typeVal !== 'text' && typeVal !== 'long_text') {
      if (_.has(record, 'max_length')) {
        _.assign(values, { max_length: null });
        console.log('!==big_int && !==real_number && !==text && !==long_text(max_length: null)', values);
      }
    }
    if (typeVal !== 'select_one' && typeVal !== 'select_many') {
      if (_.has(record, 'options')) {
        _.assign(values, { options: null });
        console.log('!==select_one && !==select_many(options: null)', values);
      }
    }
    if (typeVal !== 'date' && typeVal !== 'date_time') {
      if (_.has(record, 'date_format')) {
        _.assign(values, { date_format: null });
        console.log('!==date && !==date_time(date_format: null)', values);
      }
    }
    if (typeVal !== 'image') {
      if (_.has(record, 'img_total')) {
        _.assign(values, { img_total: null });
        console.log('!==image(img_total: null)', values);
      }
    }
    // if (typeVal !== 'boolean') {
    //   if (_.has(record, 'default_value')) {
    //     _.assign(values, { default_value: null });
    //     console.log('!==boolean( default_value: null)', values);
    //   }
    // }
    if (typeVal !== 'relation') {
      if (_.has(record, 'target_object_api_name')) _.assign(values, { target_object_api_name: null });
      if (_.has(record, 'related_list_api_name')) _.assign(values, { related_list_api_name: null });
      if (_.has(record, 'related_list_label')) _.assign(values, { related_list_label: null });
      if (_.has(record, 'on_target_delete')) _.assign(values, { on_target_delete: null });
    }

    if (typeVal == 'auto_number') {
      // 选择字段类型为自动编码 时，要将序列的对象和记录类型传给后台
      _.assign(values, {
        object_describe_name: sequenceObjName,
        record_type_name: sequencerecordTypeName,
      });
    } else {
      // 清空 sequence prefix suffix length
      if (_.has(record, 'sequence')) _.assign(values, { sequence: null });
      if (_.has(record, 'prefix')) _.assign(values, { prefix: null });
      if (_.has(record, 'suffix')) _.assign(values, { suffix: null });
      if (_.has(record, 'length')) _.assign(values, { length: null });
    }
    return values;
  };

  synOptions = (options) => {
    this.props.record.options = options;
    console.log(`父:${JSON.stringify(options, null, 2)}`);
  };

  fetchObjectList = () => {
    request({
      url: custom_objects_all,
      method: 'get',
      data: {},
    })
      .then((response) => response.data)
      .then((items) => {
        const data = items.map((obj) => ({
          text: obj.display_name,
          value: obj.api_name,
        }));
        this.setState({ targetObjects: data });
      });
  };

  fetchSequenceList = () => {
    if (_.isEmpty(this.state.sequenceList)) {
      request({
        url: `${sequence}/`,
        method: 'get',
        data: {},
      })
        .then((response) => response.data)
        .then((items) => {
          // 过滤只是该对象下的序列
          // this.props.routerQuery.objectApiName 当前字段集所属对象（通过路由传递参数）
          const filterItems = _.filter(items, (o) => {
            if (_.has(o, 'object_describe_name') && _.get(this.props, 'routerQuery.objectApiName', '')) {
              return _.get(this.props, 'routerQuery.objectApiName', '') == o.object_describe_name;
            } else {
              return true;
            }
          });
          this.setState({ sequenceList: filterItems });
        });
    }
  };

  fileExtChange = (checkedValues) => {
    console.log('checked = ', checkedValues);
  };

  // select one
  dynamicItems = () => {
    const { getFieldDecorator } = this.props.form;
    let type = this.state.type;
    if (this.props.record.type !== null && this.props.record.type !== undefined) {
      type = this.props.record.type;
    }

    // 虚字段不能设置额外属性
    const { isVirtual, disState } = this.state;
    if (isVirtual) {
      return <div />;
    }

    let ele = null;
    const sequenceOptions = () => {
      const { sequenceList } = this.state;
      return sequenceList.map((x) => (
        <Option value={x.api_name} key={x.api_name}>
          {x.label}
        </Option>
      ));
    };

    switch (type) {
      case 'text':
        ele = (
          <div>
            <hr />
            <br />
            <Row gutter={16}>
              <Col span={24}>
                <FormItem {...formSepItemLayout} label="正则表达式">
                  {getFieldDecorator('pattern', {
                    initialValue: this.props.record.pattern,
                    rules: [],
                  })(<Input placeholder="请输入正则表达式" disabled={disState} />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <FormItem {...formSepItemLayout} label="提示信息">
                  {getFieldDecorator('message', {
                    initialValue: this.props.record.message,
                  })(<Input placeholder="请输入提示信息" disabled={disState} />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="最小长度">
                  {getFieldDecorator('min_length', {
                    initialValue: this.props.record.min_length,
                    rules: [
                      {
                        required: true,
                        message: 'Please input the title of collection!',
                      },
                    ],
                  })(<Input type="number" disabled={disState} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="最大长度">
                  {getFieldDecorator('max_length', {
                    initialValue: this.props.record.max_length,
                    rules: [
                      {
                        required: true,
                        message: 'Please input the title of collection!',
                      },
                    ],
                  })(<Input type="number" disabled={disState} />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <FormItem {...formSepItemLayout} label="默认值">
                  {getFieldDecorator('default_value', {
                    initialValue: this.props.record.default_value,
                    rules: [],
                  })(<Input placeholder="请输入默认值" disabled={disState} />)}
                </FormItem>
              </Col>
            </Row>
          </div>
        );
        break;
      case 'long_text':
        ele = (
          <div>
            <hr />
            <br />
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="最小长度">
                  {getFieldDecorator('min_length', {
                    initialValue: this.props.record.min_length,
                    rules: [
                      {
                        required: false,
                        message: 'Please input the title of collection!',
                      },
                    ],
                  })(<Input type="number" disabled={disState} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="最大长度">
                  {getFieldDecorator('max_length', {
                    initialValue: this.props.record.max_length,
                    rules: [
                      {
                        required: false,
                        message: 'Please input the title of collection!',
                      },
                    ],
                  })(<Input type="number" disabled={disState} />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <FormItem {...formSepItemLayout} label="默认值">
                  {getFieldDecorator('default_value', {
                    initialValue: this.props.record.default_value,
                    rules: [],
                  })(<Input placeholder="请输入默认值" disabled={disState} />)}
                </FormItem>
              </Col>
            </Row>
          </div>
        );
        break;
      case 'phone':
      case 'email':
      case 'big_int':
        ele = (
          <div>
            <hr />
            <br />
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="最大长度">
                  {getFieldDecorator('max_length', {
                    initialValue: this.props.record.max_length,
                    rules: [
                      {
                        required: false,
                        message: 'Please input the title of collection!',
                      },
                    ],
                  })(<Input type="number" disabled={disState} />)}
                </FormItem>
              </Col>
              <Col span={12} />
            </Row>
          </div>
        );
        break;
      case 'real_number':
        ele = (
          <div>
            <hr />
            <br />
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="最大长度">
                  {getFieldDecorator('max_length', {
                    initialValue: this.props.record.max_length,
                    rules: [
                      {
                        required: true,
                        message: 'Please enter the maximum length.',
                      },
                    ],
                  })(<Input type="number" disabled={disState} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="小数点位数">
                  {getFieldDecorator('decimal_places', {
                    initialValue: this.props.record.decimal_places,
                    rules: [
                      {
                        required: true,
                        message: 'Please select the decimal number.',
                      },
                    ],
                  })(
                    <Select placeholder="Please select one field type" disabled={disState}>
                      <Option value="1">1</Option>
                      <Option value="2">2</Option>
                      <Option value="3">3</Option>
                      <Option value="4">4</Option>
                      <Option value="5">5</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>
        );
        break;
      case 'image':
        ele = (
          <div>
            <hr />
            <br />
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="最多上传几张">
                  {getFieldDecorator('max_count', {
                    initialValue: this.props.record.max_count || '1',
                    rules: [
                      {
                        required: false,
                        message: 'Please input the title of collection!',
                      },
                    ],
                  })(
                    <Select placeholder="Please select one field type" disabled={disState}>
                      <Option value="1">1 </Option>
                      <Option value="2">2</Option>
                      <Option value="3">3</Option>
                      <Option value="4">4</Option>
                      <Option value="5">5</Option>
                      <Option value="6">6</Option>
                      <Option value="7">7</Option>
                      <Option value="8">8</Option>
                      <Option value="9">9</Option>
                      <Option value="10">10</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12} />
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="小缩略图尺寸">
                  {getFieldDecorator('thumbnail_s', {
                    initialValue: this.props.record.thumbnail_s,
                    rules: [],
                  })(<Input placeholder="格式宽_长，例如 200_100" disabled={disState} />)}
                </FormItem>
              </Col>
              <Col span={12} />
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="中缩略图尺寸">
                  {getFieldDecorator('thumbnail_m', {
                    initialValue: this.props.record.thumbnail_m,
                    rules: [],
                  })(<Input placeholder="格式宽_长，例如 200_100" disabled={disState} />)}
                </FormItem>
              </Col>
              <Col span={12} />
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="大缩略图尺寸">
                  {getFieldDecorator('thumbnail_l', {
                    initialValue: this.props.record.thumbnail_l,
                    rules: [],
                  })(<Input placeholder="格式宽_长，例如 200_100" disabled={disState} />)}
                </FormItem>
              </Col>
              <Col span={12} />
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="单个图像最大">
                  {getFieldDecorator('max_size', {
                    initialValue: this.props.record.max_size,
                    rules: [{ required: true, message: '1MB=1024KB' }],
                  })(<Input placeholder="" type="number" disabled={disState} />)}
                </FormItem>
              </Col>
              <Col span={1} style={{ paddingTop: 6 }}>
                KB
              </Col>
              <Col span={11} />
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="仅允许使用相机拍摄">
                  {getFieldDecorator('is_camera_only', {
                    initialValue: this.props.record.is_camera_only || false,
                    rules: [],
                  })(
                    <Radio.Group disabled={disState}>
                      <Radio value>是</Radio>
                      <Radio value={false}>否</Radio>
                    </Radio.Group>,
                  )}
                </FormItem>
              </Col>
              <Col span={12} />
            </Row>
          </div>
        );
        break;
      case 'attachment': {
        const fileExtensions = [
          { label: 'Word', value: 'word' },
          { label: 'Excel', value: 'excel' },
          { label: 'PPT', value: 'ppt' },
          { label: 'TXT', value: 'txt' },
          { label: 'PDF', value: 'pdf' },
          { label: 'IMG', value: 'img' },
          { label: 'MP4', value: 'mp4' },
          { label: 'RAR', value: 'rar' },
          { label: 'ZIP', value: 'zip' },
        ];
        ele = (
          <div>
            <hr />
            <br />
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="最多上传文件数">
                  {getFieldDecorator('max_count', {
                    initialValue: this.props.record.max_count || '1',
                    rules: [
                      {
                        required: false,
                        message: 'Please input the title of collection!',
                      },
                    ],
                  })(
                    <Select placeholder="Please select one field type" disabled={disState}>
                      <Option value="1">1 </Option>
                      <Option value="2">2</Option>
                      <Option value="3">3</Option>
                      <Option value="4">4</Option>
                      <Option value="5">5</Option>
                      <Option value="6">6</Option>
                      <Option value="7">7</Option>
                      <Option value="8">8</Option>
                      <Option value="9">9</Option>
                      <Option value="unlimited">不限</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12} />
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="支持的文件类型">
                  {getFieldDecorator('file_ext', {
                    initialValue: this.props.record.file_ext || ['txt'],
                    rules: [
                      {
                        required: false,
                        message: '请输入支持的文件类型!',
                      },
                    ],
                  })(<CheckboxGroup options={fileExtensions} onChange={this.fileExtChange} disabled={disState} />)}
                </FormItem>
              </Col>
              <Col span={12} />
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="单个文件最大">
                  {getFieldDecorator('max_size', {
                    initialValue: this.props.record.max_size,
                    rules: [{ required: true, message: 'Unit: K' }],
                  })(<Input placeholder="" type="number" disabled={disState} />)}
                </FormItem>
              </Col>
              <Col span={1} style={{ paddingTop: 6 }}>
                KB
              </Col>
              <Col span={11} />
            </Row>
          </div>
        );
        break;
      }
      case 'date':
      case 'date_time':
        ele = (
          <Row gutter={16}>
            <Col span={24}>
              <FormItem className="collection-create-form_last-form-item" {...formItemLayout} label="日期类型">
                {getFieldDecorator('date_format', {
                  initialValue:
                    this.props.record.data_format === undefined ? 'YYYY-MM-DD' : this.props.record.data_format,
                  rules: [
                    {
                      required: true,
                      message: 'Please input the title of collection!',
                    },
                  ],
                })(
                  <Radio.Group disabled={disState}>
                    <Radio value="YYYY-MM-DD">日期</Radio>
                    <Radio value="YYYY-MM-DD HH:mm:ss">日期+时间</Radio>
                  </Radio.Group>,
                )}
              </FormItem>
            </Col>
          </Row>
        );
        break;
      case 'select_one': {
        const WrappedDynamicFieldSetOne = Form.create({
          onFieldsChange() {
            //  console.log('父：onFieldsChange');
          },
          mapPropsToFields() {
            //  console.log('父：mapPropsToFields');
          },
          onValuesChange() {
            //  console.log('父：onValuesChange');
          },
        })(DynamicFieldSet);
        ele = (
          <div>
            <hr />
            <br />
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="默认值">
                  {getFieldDecorator('default_value', {
                    initialValue: this.props.record.default_value,
                    rules: [
                      {
                        required: false,
                        message: 'Please input the title of collection!',
                      },
                    ],
                  })(<Input placeholder="请输入默认的option value" type="text" disabled={disState} />)}
                </FormItem>
              </Col>
            </Row>
            <WrappedDynamicFieldSetOne
              options={this.props.record.options}
              synOptions={this.synOptions}
              disabledstate={disState}
            />
          </div>
        );

        break;
      }
      case 'select_many': {
        const WrappedDynamicFieldSetOne = Form.create({
          onFieldsChange() {
            //  console.log('父：onFieldsChange');
          },
          mapPropsToFields() {
            //  console.log('父：mapPropsToFields');
          },
          onValuesChange() {
            //  console.log('父：onValuesChange');
          },
        })(DynamicFieldSet);
        ele = (
          <WrappedDynamicFieldSetOne
            options={this.props.record.options}
            synOptions={this.synOptions}
            disabledstate={disState}
          />
        );
        break;
      }
      case 'relation': {
        const { targetObjects } = this.state;

        const profileChildren = targetObjects.map((pro) => {
          return (
            <Option value={`${pro.value}`} key={pro.value}>
              {pro.text}
            </Option>
          );
        });
        ele = (
          <div>
            <hr />
            <br />
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="业务对象">
                  {getFieldDecorator('target_object_api_name', {
                    initialValue: this.props.record.target_object_api_name,
                    rules: [
                      {
                        required: false,
                        message: 'Please input the title of collection!',
                      },
                    ],
                  })(
                    <Select
                      placeholder="Please select one field type"
                      showSearch
                      optionFilterProp="children"
                      disabled={disState}
                    >
                      {profileChildren}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="删除规则">
                  {getFieldDecorator('on_target_delete', {
                    initialValue: this.props.record.on_target_delete,
                    rules: [
                      {
                        required: false,
                        message: 'Please input the title of collection!',
                      },
                    ],
                  })(
                    <Select placeholder="Please select one field type" disabled={disState}>
                      <Option value="set_null" title="将关联关系字段设置为空值， 默认值">
                        默认
                      </Option>
                      <Option value="cascade" title="级联删除">
                        级联删除
                      </Option>
                      <Option value="do_not_allow" title="父对象下有子对象时不允许删除">
                        父对象下有子对象时不允许删除
                      </Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="相关API名称">
                  {getFieldDecorator('related_list_api_name', {
                    initialValue: this.props.record.related_list_api_name,
                    rules: [
                      {
                        required: false,
                        message: 'Please input the title of collection!',
                      },
                    ],
                  })(<Input disabled={disState} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="相关名称">
                  {getFieldDecorator('related_list_label', {
                    initialValue: this.props.record.related_list_label,
                    rules: [
                      {
                        required: false,
                        message: 'Please input the title of collection!',
                      },
                    ],
                  })(<Input disabled={disState} />)}
                </FormItem>
              </Col>
            </Row>
          </div>
        );
        break;
      }
      case 'boolean':
        ele = (
          <div>
            <hr />
            <br />
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="默认值">
                  {getFieldDecorator('default_value', {
                    initialValue: this.props.record.default_value,
                    rules: [
                      {
                        required: false,
                        message: 'Please input the title of collection!',
                      },
                    ],
                  })(
                    <Radio.Group disabled={disState}>
                      <Radio value>选中</Radio>
                      <Radio value={false}>不选中</Radio>
                    </Radio.Group>,
                  )}
                </FormItem>
              </Col>
              <Col span={12} />
            </Row>
          </div>
        );
        break;
      case 'currency':
      case 'auto_number':
        ele = (
          <div>
            <hr />
            <br />
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="序列名称">
                  {getFieldDecorator('sequence', {
                    initialValue: this.props.record.sequence,
                    rules: [
                      {
                        required: true,
                        message: 'Please input the sequence API name',
                      },
                    ],
                  })(
                    <Select placeholder="请选择序列" disabled={disState} onChange={this.handleSequenceChange}>
                      {sequenceOptions()}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12} />
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="前缀">
                  {getFieldDecorator('prefix', {
                    initialValue: this.props.record.prefix,
                    rules: [
                      {
                        required: false,
                        message: 'Please input the title of collection!',
                      },
                    ],
                  })(<Input disabled={disState} />)}
                </FormItem>
              </Col>
              <Col span={12} />
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="后缀">
                  {getFieldDecorator('suffix', {
                    initialValue: this.props.record.suffix,
                    rules: [
                      {
                        required: false,
                        message: 'Please input the title of collection!',
                      },
                    ],
                  })(<Input disabled={disState} />)}
                </FormItem>
              </Col>
              <Col span={12} />
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="长度(仅数值部分)">
                  {getFieldDecorator('length', {
                    initialValue: this.props.record.length || 5,
                    rules: [{ required: true, message: 'please input length' }],
                  })(<InputNumber min={1} max={20} disabled={disState} />)}
                </FormItem>
              </Col>
              <Col span={12} />
            </Row>
          </div>
        );
        break;
      case 'percentage':
        ele = (
          <div>
            <hr />
            <br />
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="整数长度">
                  {getFieldDecorator('integer_max_length', {
                    initialValue: this.props.record.integer_max_length || '2',
                    rules: [
                      {
                        required: false,
                        message: 'Please input the integer_max_length API name',
                      },
                    ],
                  })(<Select disabled={disState}>{this.renderPercentageOptions()}</Select>)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="小数长度">
                  {getFieldDecorator('decimal_max_length', {
                    initialValue: this.props.record.decimal_max_length || '3',
                    rules: [
                      {
                        required: false,
                        message: 'Please input the decimal_max_length API name',
                      },
                    ],
                  })(<Select disabled={disState}>{this.renderPercentageOptions()}</Select>)}
                </FormItem>
              </Col>
            </Row>
          </div>
        );
        break;
      case 'url':
        ele = (
          <div>
            <hr />
            <br />
            <Row gutter={16}>
              <Col span={24}>
                <FormItem {...formSepItemLayout} label="正则表达式">
                  {getFieldDecorator('pattern', {
                    initialValue: _.get(this.props.record, 'pattern', '^((https|http)?:\\/\\/)[^\\s]+'),
                    rules: [],
                  })(
                    <TextArea
                      autosize={{ minRows: 1, maxRows: 6 }}
                      style={{ fontSize: 15 }}
                      placeholder="请输入正则表达式"
                      disabled={disState}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <FormItem {...formSepItemLayout} label="提示信息">
                  {getFieldDecorator('message', {
                    initialValue: this.props.record.message,
                  })(<Input placeholder="请输入提示信息" disabled={disState} />)}
                </FormItem>
              </Col>
            </Row>
          </div>
        );
        break;
      case 'rel_fields':
      case 'percent':
      case 'time':
      default:
        break;
    }
    return ele;
  };

  renderPercentageOptions = () => {
    return ['1', '2', '3', '4', '5'].map((v, i) => (
      <Option value={v} key={`percentageOption${i}`}>
        {v}
      </Option>
    ));
  };

  render() {
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
      api_name,
      is_unique,
      label,
      define_type,
      is_active,
      is_required,
      description,
      column_type,
      help_text,
      is_virtual,
      type,
    } = this.props.record;
    const { disState } = this.state;
    const columnTypeSelect = () => {
      if (type === 'image' || type === 'select_many') {
        return (
          <Select placeholder="Please select one field type" disabled={disState}>
            <Option value="ext">ext</Option>
          </Select>
        );
      } else {
        return (
          <Select placeholder="Please select one field type" disabled={disState}>
            <Option value="standard">standard</Option>
            <Option value="ext">ext</Option>
          </Select>
        );
      }
    };

    return (
      <span>
        <span onClick={this.showModalHandler}>{children}</span>
        <Modal
          title="编辑字段"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
          maskClosable={false}
          width="800px"
          footer={[
            <Button key="back" size="large" onClick={this.hideModelHandler}>
              返回
            </Button>,
            <Button key="submit" type="primary" size="large" onClick={this.okHandler} disabled={this.state.disState}>
              提交
            </Button>,
          ]}
        >
          <Form horizontal onSubmit={this.okHandler}>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="API名称" key={api_name}>
                  {getFieldDecorator('api_name', {
                    initialValue: api_name,
                    rules: [
                      {
                        required: true,
                        message: 'Please input the title of collection!',
                      },
                    ],
                  })(<Input disabled={disState || this.state.editDisState} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="字段名称">
                  {getFieldDecorator('label', {
                    initialValue: label,
                    rules: [
                      {
                        required: true,
                        message: 'Please input the title of collection!',
                      },
                    ],
                  })(<Input disabled={disState} />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="字段类型" hasFeedback>
                  {getFieldDecorator('type', {
                    initialValue: this.props.record.type,
                    rules: [
                      {
                        required: true,
                        message: 'Please select one field type!',
                      },
                    ],
                  })(
                    <Select
                      placeholder="Please select one field type"
                      onChange={this.handleFormTypeChange}
                      disabled={disState}
                    >
                      <Option value="text">文本</Option>
                      <Option value="long_text">文本域</Option>
                      <Option value="geolocation">地理位置</Option>
                      <Option value="date_time">日期类型</Option>
                      <Option value="time">时间</Option>
                      <Option value="real_number">实数</Option>
                      <Option value="big_int">整数</Option>
                      <Option value="image">图像</Option>
                      <Option value="select_one">单选</Option>
                      <Option value="select_many">多选</Option>
                      <Option value="relation">关联关系</Option>
                      <Option value="boolean">布尔型</Option>
                      <Option value="auto_number">自动编号</Option>
                      <Option value="attachment">附件</Option>
                      <Option value="percentage">百分比</Option>
                      <Option value="url">URL</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="列类型" hasFeedback>
                  {getFieldDecorator('column_type', {
                    initialValue: column_type,
                    rules: [
                      {
                        required: true,
                        message: 'Please select one field type!',
                      },
                    ],
                  })(columnTypeSelect())}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="是否为虚字段" hasFeedback>
                  {getFieldDecorator('is_virtual', {
                    initialValue: is_virtual === undefined ? false : is_virtual,
                    rules: [{ required: true, message: '请设置是否为虚字段' }],
                  })(
                    <Radio.Group onChange={this.handleIsVirtualChange} disabled={disState}>
                      <Radio value>是</Radio>
                      <Radio value={false}>否</Radio>
                    </Radio.Group>,
                  )}
                </FormItem>
              </Col>
              <Col span={12} />
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="包名">
                  {getFieldDecorator('package', {
                    initialValue: this.props.record.package,
                    rules: [
                      {
                        required: true,
                        message: 'Please input the title of collection!',
                      },
                    ],
                  })(<Input disabled={disState} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="定义类型">
                  {getFieldDecorator('define_type', {
                    initialValue: define_type || 'custom',
                    rules: [
                      {
                        required: true,
                        message: 'Please input the title of collection!',
                      },
                    ],
                  })(
                    <Select placeholder="Please select one field type" disabled={disState}>
                      <Option value="system">system </Option>
                      <Option value="package">package</Option>
                      <Option value="custom">custom</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="帮助信息">
                  {getFieldDecorator('help_text', {
                    initialValue: help_text,
                    rules: [{ required: false }],
                  })(<Input disabled={disState} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem className="collection-create-form_last-form-item" {...formItemLayout} label="是否必填">
                  {getFieldDecorator('is_required', {
                    initialValue: is_required === undefined ? false : is_required,
                    rules: [
                      {
                        required: true,
                        message: 'Please input the title of collection!',
                      },
                    ],
                  })(
                    <Radio.Group disabled={disState}>
                      <Radio value>是</Radio>
                      <Radio value={false}>否</Radio>
                    </Radio.Group>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem className="collection-create-form_last-form-item" {...formItemLayout} label="是否启用">
                  {getFieldDecorator('is_active', {
                    initialValue: is_active === undefined ? true : is_active,
                    rules: [
                      {
                        required: true,
                        message: 'Please input the title of collection!',
                      },
                    ],
                  })(
                    <Radio.Group disabled={disState}>
                      <Radio value>是</Radio>
                      <Radio value={false}>否</Radio>
                    </Radio.Group>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem className="collection-create-form_last-form-item" {...formItemLayout} label="是否唯一">
                  {getFieldDecorator('is_unique', {
                    initialValue: is_unique === undefined ? false : is_unique,
                    rules: [
                      {
                        required: true,
                        message: 'Please input the title of collection!',
                      },
                    ],
                  })(
                    <Radio.Group disabled={disState}>
                      <Radio value>是</Radio>
                      <Radio value={false}>否</Radio>
                    </Radio.Group>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <FormItem {...formSepItemLayout} label="描述">
                  {getFieldDecorator('description', {
                    initialValue: description,
                    rules: [
                      {
                        required: false,
                        message: 'Please input the title of collection!',
                      },
                    ],
                  })(<Input type="textarea" rows={2} disabled={disState} />)}
                </FormItem>
              </Col>
            </Row>
            {this.dynamicItems()}
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(CustomFieldEditModal);
