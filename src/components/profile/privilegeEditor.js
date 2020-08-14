/* eslint-disable max-len,no-unused-vars */
/**
 * Created by xinli on 2017/9/7.
 */
import React, { Component } from 'react';
import {
  Tabs,
  Table,
  Button,
  Modal,
  Radio,
  Checkbox,
  Switch,
  Row,
  Col,
  Spin,
  Form,
  Input,
  Select,
  message,
  Tag,
} from 'antd';
import _ from 'lodash';
import prettyJSONStringify from 'pretty-json-stringify';
import * as objectService from '../../services/customObjects';
import * as tabService from '../../services/tab';
import * as functionPermissionService from '../../services/functionPermission';
import * as profileService from '../../services/simpleProfile';
import AppAuthorizeTable from './appAuthorizeTable';

const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

const ObjectPermissionTable = ({
  objects,
  permission,
  onObjectPrivilegeCheck,
  onFieldPrivilegeCheck,
  onBatchSetField,
  onChangeConfiguration,
  defaultValue,
}) => {
  const expandedRowRender = (record) => {
    const { api_name: objApiName } = record;
    const fieldOptions = [
      { label: '禁止访问', value: 0 },
      { label: '只读', value: 1 },
      { label: '完全控制', value: 2 },
    ];
    const { Option } = Select;
    /**
     * 解析全部配置项数据
     * @param {*} arr 全部配置项数据
     */
    function getoptions(arr) {
      const options = [];
      _.map(arr, (Item) => {
        options.push(<Option key={Item.value}>{Item.label}</Option>);
      });
      return options;
    }
    /**
     * 解析选中配置项数据
     * @param {*} objApiName
     * @param {*} fieldApiName
     */
    function getselectedoptios(objApiName, fieldApiName) {
      const defaultValues = [];
      const dafultSelected = defaultValue || {};
      if (!_.isEmpty(_.get(dafultSelected, objApiName, {}))) {
        if (!_.isEmpty(_.get(dafultSelected, `${objApiName}.${fieldApiName}`, []))) {
          _.map(dafultSelected[objApiName][fieldApiName], (Item) => {
            defaultValues.push(Item.value);
          });
        }
      }
      return defaultValues;
    }
    const columns = [
      { title: 'API_NAME', dataIndex: 'api_name', key: 'api_name', width: 100 },
      { title: '字段名', dataIndex: 'label', key: 'label', width: 100 },
      {
        title: '权限',
        width: 200,
        key: 'privileges',
        render: (text, field) => {
          const recordPermission = permission[`field.${objApiName}.${field.api_name}`];
          return (
            <RadioGroup
              value={
                !_.isUndefined(recordPermission) && !_.isNull(recordPermission)
                  ? Math.log2(recordPermission || 1)
                  : null
              }
              options={fieldOptions}
              onChange={(e) => {
                onFieldPrivilegeCheck(objApiName, field.api_name, [e.target.value]);
              }}
            />
          );
        },
      },
      {
        width: 180,
        render: (text, field) => {
          const options = [];
          return (
            <div>
              {field.options ? (
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请选择配置项"
                  defaultValue={getselectedoptios(objApiName, field.api_name)}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  onChange={(values, labal) => {
                    onChangeConfiguration(objApiName, field.api_name, values, field.options);
                  }}
                >
                  {getoptions(field.options)}
                </Select>
              ) : null}
            </div>
          );
        },
      },
    ];

    const { fields } = record;
    if (fields && fields.length > 0) {
      return (
        <Table
          title={(record) => {
            return (
              <Row gutter={12} type="flex" justify="space-between" align="bottom">
                <Col span={12} style={{ textAlign: 'right' }}>
                  <span>批量设置：</span>
                  <Button
                    onClick={(e) => {
                      onBatchSetField(objApiName, 0);
                    }}
                    style={{ marginRight: 5 }}
                  >
                    禁止访问
                  </Button>
                  <Button
                    onClick={(e) => {
                      onBatchSetField(objApiName, 1);
                    }}
                    style={{ marginRight: 5 }}
                  >
                    只读
                  </Button>
                  <Button
                    onClick={(e) => {
                      onBatchSetField(objApiName, 2);
                    }}
                  >
                    完全控制
                  </Button>
                </Col>
              </Row>
            );
          }}
          columns={columns}
          rowKey="id"
          dataSource={fields}
          pagination={false}
        />
      );
    } else {
      return <div>No Fields Defined</div>;
    }
  };

  const objectPrivilegeOptions = [
    { label: '新增', value: 1 },
    { label: '编辑', value: 2 },
    { label: '查看', value: 3 },
    { label: '删除', value: 4 },
    { label: '列表', value: 5 },
    { label: '导入', value: 6 },
    { label: '导出', value: 7 },
  ];

  const objectDefaultPrivileges = (api_name) => {
    const code = permission[`obj.${api_name}`];
    if (code > 0) {
      const selected = [1, 2, 3, 4, 5, 6, 7].reduce((result, x) => {
        const privilegeCode = 2 ** x;
        if ((code & privilegeCode) === privilegeCode) {
          result.push(x);
        }
        return result;
      }, []);
      return selected;
    } else {
      return [];
    }
  };

  const isObjectPrivilegeAll = (objApiName) => {
    const code = permission[`obj.${objApiName}`];
    return code === 254;
  };

  const columns = [
    { title: '对象', dataIndex: 'display_name', key: 'display_name' },
    { title: 'API_NAME', dataIndex: 'api_name', key: 'api_name' },
    { title: '包名', dataIndex: 'package', key: 'package' },
    {
      title: '权限',
      dataIndex: 'privilege',
      key: 'privilege',
      render: (text, record) => {
        return (
          <CheckboxGroup
            key={`obj-cbx-group-${record.api_name}`}
            value={objectDefaultPrivileges(record.api_name)}
            options={objectPrivilegeOptions}
            onChange={(values) => {
              onObjectPrivilegeCheck(record.api_name, values);
            }}
          />
        );
      },
    },
    {
      title: '全选',
      dataIndex: '',
      key: 'action-all',
      render: (text, record) => {
        return (
          <Switch
            key={`obj-select-all-${record.api_name}`}
            defaultChecked={false}
            checked={isObjectPrivilegeAll(record.api_name)}
            onChange={(checked) => {
              onObjectPrivilegeCheck(record.api_name, checked ? [1, 2, 3, 4, 5, 6, 7] : []);
            }}
          />
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      rowKey="id"
      expandedRowRender={expandedRowRender}
      pagination={false}
      dataSource={objects}
    />
  );
};

const TabPermissionTable = ({ tabs, onTabPrivilegeCheck, permission }) => {
  const tabsTable = {
    rowKey: 'api_name',
    dataSource: tabs || [],
    pagination: false,
    columns: [
      { title: '菜单名称', dataIndex: 'label', key: 'label' },
      { title: 'API_NAME', dataIndex: 'api_name', key: 'api_name' },
      {
        title: '定义类型',
        dataIndex: 'define_type',
        key: 'define_type',
        render: (text, record) => {
          const defineType = text || 'custom';
          if (defineType == 'custom') {
            return <Tag color="green">{defineType}</Tag>;
          } else {
            return <Tag color="red">{defineType}</Tag>;
          }
        },
      },
      {
        title: '菜单类型',
        dataIndex: 'type',
        key: 'type',
        render: (text, record) => {
          const type = text || 'menu';
          if (type == 'sub_menu') {
            return <Tag color="purple">{type}</Tag>;
          } else {
            return <Tag>{type}</Tag>;
          }
        },
      },
      {
        title: '权限',
        dataIndex: 'privilege',
        key: 'privilege',
        render: (text, record) => {
          // 27/02/2018 - TAG: 权限值
          const recordPermission = permission[`tab.${record.api_name}`];
          return (
            <RadioGroup
              options={[
                { label: '禁止', value: 0 },
                { label: '允许', value: 1 },
              ]}
              value={
                !_.isUndefined(recordPermission) && !_.isNull(recordPermission)
                  ? Math.log2(recordPermission || 1)
                  : null
              }
              onChange={(e) => {
                onTabPrivilegeCheck(record.api_name, [e.target.value]);
              }}
            />
          );
        },
      },
    ],
  };

  return <Table {...tabsTable} />;
};

const FunctionPermissionTable = ({ functions, onFunctionPrivilegeCheck, permission, onRowDelete }) => {
  const functionTable = {
    rowKey: 'api_name',
    dataSource: functions || [],
    pagination: false,
    columns: [
      { title: '功能名称', dataIndex: 'function_name', key: 'function_name' },
      { title: 'API_NAME', dataIndex: 'api_name', key: 'api_name' },
      {
        title: '权限',
        dataIndex: 'privilege',
        key: 'privilege',
        render: (text, record) => {
          // 27/02/2018 - TAG: 权限值
          const recordPermission = permission[`function.${record.api_name}`];
          return (
            <RadioGroup
              options={[
                { label: '禁止', value: 0 },
                { label: '允许', value: 1 },
              ]}
              value={
                !_.isUndefined(recordPermission) && !_.isNull(recordPermission)
                  ? Math.log2(recordPermission || 1)
                  : null
              }
              onChange={(e) => {
                onFunctionPrivilegeCheck(record.api_name, [e.target.value]);
              }}
            />
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        render: (text, record) => {
          if (record.id) {
            return (
              <Button
                onClick={() => {
                  if (onRowDelete) {
                    onRowDelete(record);
                  }
                }}
              >
                删除
              </Button>
            );
          } else {
            return null;
          }
        },
      },
    ],
  };

  return <Table {...functionTable} />;
};

const FunctionPermissionForm = Form.create()(({ visible, form, function_permission, onOk, onCancel }) => {
  const { getFieldDecorator } = form;
  return (
    <Modal visible={visible} onOk={onOk} onCancel={onCancel}>
      <Form>
        <FormItem label="功能名称">
          {getFieldDecorator('function_name', {
            rules: [{ required: true, message: '请输入功能名称' }],
          })(<Input />)}
        </FormItem>
        <FormItem label="API_NAME">
          {getFieldDecorator('api_name', {
            rules: [{ required: true, message: '请输入API_NAME' }],
          })(<Input />)}
        </FormItem>
        <FormItem label="定义类型">
          {getFieldDecorator('define_type', {
            rules: [{ required: true, message: '请输入定义类型' }],
          })(
            <Select>
              <Select.Option value="system">system</Select.Option>
              <Select.Option value="package">package</Select.Option>
              <Select.Option value="custom">custom</Select.Option>
            </Select>,
          )}
        </FormItem>
      </Form>
    </Modal>
  );
});

class PrivilegeEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      objects: [],
      tabs: [],
      functions: [
        {
          api_name: 'publish_notice',
          function_name: '发布公告',
        },
        // {
        //   api_name: 'add_coach_meeting',
        //   function_name: '新建会议辅导',
        // },
        // {
        //   api_name: 'add_coach_assist',
        //   function_name: '新建实地协访',
        // },
        // {
        //   api_name: 'add_coach_regional',
        //   function_name: '新建区域辅导',
        // },
        // {
        //   api_name: 'add_coach_sales',
        //   function_name: '新建销售拜访辅导',
        // },
        // {
        //   api_name: 'add_call_plan',
        //   function_name: '新建拜访计划',
        // },
        // {
        //   api_name: 'add_call_report',
        //   function_name: '新建拜访记录',
        // },
        // {
        //   api_name: 'add_event',
        //   function_name: '新建活动',
        // },
        // {
        //   api_name: 'add_tot',
        //   function_name: '新建离岗活动',
        // },
        // {
        //   api_name: 'add_clm',
        //   function_name: '创建CLM',
        // },
        // {
        //   api_name: 'add_customer_hcp',
        //   function_name: '新建医生',
        // },
        // {
        //   api_name: 'add_customer_hco',
        //   function_name: '新建医院',
        // },
      ],
      loading: true,
      permission: {},
      defaultValue: [],
      selected_options: props.selected_options,
      id: props.id,
      version: props.version,
      showFunctionPermissionForm: false,
      showSelected: false,
      app_authorize: props.app_authorize || [],
    };
    this.onSave = props.onSave || (() => {});
  }
  componentWillMount() {
    objectService.fetchAllIncludeFields().then((response) => {
      const { data: objects } = response;
      this.setState({
        objects,
        loading: false,
      });
    });
    tabService.fetch().then((response) => {
      const { items: tabs } = response.data.data.body;
      this.setState({
        tabs,
      });
    });
    functionPermissionService.fetch().then((response) => {
      if (response.data) {
        const { items } = response.data.data.body;
        const { functions } = this.state;
        this.setState({
          functions: functions.concat(items),
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { id, permission, version, selected_options, app_authorize } = nextProps;
    const oldPermissionString = JSON.stringify(permission);
    const oldselected_options = selected_options;
    this.setState({
      id,
      permission,
      version,
      oldPermissionString,
      selected_options: selected_options || {},
      oldselected_options,
      app_authorize: app_authorize || [],
    });
    // console.log(this.state.selected_options, '000000000');
  }

  onObjectPrivilegeCheck = (objApiName, v) => {
    const privilegeKey = `obj.${objApiName}`;
    this.updatePermissionKey(privilegeKey, v);
  };

  onFieldPrivilegeCheck = (objApiName, fieldApiName, v) => {
    const privilegeKey = `field.${objApiName}.${fieldApiName}`;
    this.updatePermissionKey(privilegeKey, v);
  };
  /**
   * 修改配置项
   */
  onChangeConfiguration = (objApiName, fieldApiName, v, options) => {
    const { selected_options, oldselected_options } = this.state;
    const dataoptions = [];
    const defaultValue = v;
    _.map(options, (items) => {
      _.map(v, (field) => {
        if (items.value == field) {
          dataoptions.push(items);
        }
      });
    });
    if (_.isEmpty(_.get(selected_options, objApiName, {}))) {
      const newobject = { [objApiName]: { [fieldApiName]: dataoptions } };
      this.setState({ selected_options: Object.assign(selected_options, newobject), showSelected: true });
    }
    if (!_.isEmpty(_.get(selected_options, objApiName, {}))) {
      if (_.isEmpty(_.get(selected_options, `${objApiName}.${fieldApiName}`, []))) {
        const newobject = { [fieldApiName]: dataoptions };
        this.setState({ selected_options: Object.assign(selected_options[objApiName], newobject), showSelected: true });
      }
    }
    if (!_.isEmpty(_.get(selected_options, objApiName, {}))) {
      if (!_.isEmpty(_.get(selected_options, `${objApiName}.${fieldApiName}`, []))) {
        const newobject = selected_options;
        newobject[objApiName][fieldApiName] = dataoptions;
        this.setState({ selected_options: newobject, showSelected: true });
      }
    }
    // console.log(oldselected_options, '000000000');
    // console.log(this.state.selected_options, '11111111');
    // const { id } = this.state;
    // this.onQuery({ profile: id, apiName: objApiName, fieldApiName, data: dataoptions });
    // profileService.getSimpleProfileById({ id: id })
    //   .then((response) => {
    //     if (response.data) {
    //       const { selected_options } = response.data.data.body;
    //       this.setState({
    //          selected_options: selected_options,
    //       });
    //     }
    //   });
  };

  onBatchSetField = (objApiName, v) => {
    const { objects, permission } = this.state;
    const object = objects.find((x) => x.api_name === objApiName);
    if (object && Array.isArray(object.fields)) {
      object.fields.forEach((field) => {
        permission[`field.${objApiName}.${field.api_name}`] = 2 ** v;
      });
      this.setState({
        permission,
      });
    }
  };

  onTabPrivilegeCheck = (tabApiName, v) => {
    const privilegeKey = `tab.${tabApiName}`;
    this.updatePermissionKey(privilegeKey, v);
  };

  onFunctionPrivilegeCheck = (functionApiName, v) => {
    const privilegeKey = `function.${functionApiName}`;
    this.updatePermissionKey(privilegeKey, v);
  };

  onCreateFunctionPermissionClick = () => {
    this.setState({
      showFunctionPermissionForm: true,
    });
  };

  saveFunctionPermissionHandler = (functionPermission) => {
    const form = this.functionPermissionForm;
    const { functions } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      if (functions.find((x) => x.api_name === values.api_name)) {
        form.setFields({
          api_name: {
            value: values.api_name,
            errors: [new Error('API_NAME 重复')],
          },
        });
        return;
      }

      functionPermissionService.create(values).then((response) => {
        const data = response.data.data;
        if (data.head.code === 200) {
          const { functions: oldFunctions } = this.state;
          this.setState({
            functions: [].concat(data.body).concat(oldFunctions),
            showFunctionPermissionForm: false,
          });
          message.success('创建成功');
          form.resetFields();
        } else {
          message.error('创建失败');
        }
      });
    });
  };

  deleteFunctionPermissionHandler = (record) => {
    functionPermissionService.deleteFunctionPermission(record).then((response) => {
      const data = response.data.data;
      if (data.head.code === 200) {
        const { functions: oldFunctions } = this.state;
        this.setState({
          functions: oldFunctions.filter((x) => !x.id || x.id !== record.id),
        });
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
    });
  };

  saveFunctionPermissionFormRef = (form) => {
    this.functionPermissionForm = form;
  };

  // 27/02/2018 - TAG: 更新权限
  updatePermissionKey = (privilegeKey, v) => {
    const values = v || [];
    const code = values.reduce((sum, value) => {
      // 27/02/2018 - TAG: 应该先判断是否对权限做了更改，一个新的简档，默认是没有权限的，因此value值不存在或者未定义，
      // 27/02/2018 - TAG: value为0时，表示禁止，为1时表示允许
      return sum + (!_.isUndefined(value) && !_.isNull(value) ? 2 ** value : 0);
    }, 0);
    const { permission } = this.state;
    if (code > 0) {
      permission[privilegeKey] = code;
    } else {
      delete permission[privilegeKey];
    }
    this.setState({
      permission,
    });
  };

  savePermission = () => {
    const { id, version, permission, selected_options } = this.state;
    const saveValues = { id, version, permission, selected_options };
    if (this.appAuthorizeRefs) {
      const appAuthorizeVal = this.appAuthorizeRefs.onAppAuthorizeSave();
      if (!_.isEmpty(appAuthorizeVal)) {
        saveValues.app_authorize = _.get(appAuthorizeVal, 'app_authorize', []);
      } else {
        return false;
      }
    }
    this.onSave(saveValues);
    this.setState({ showSelected: false });
  };

  showPermissionCodes = () => {
    const { permission } = this.state;
    const formattedPermission = prettyJSONStringify(permission || {});
    Modal.info({
      title: 'This is a notification message',
      width: '800px',
      content: (
        <div>
          <pre>{formattedPermission}</pre>
        </div>
      ),
      onOk() {},
    });
  };

  permissionNotChanged = () => {
    const { permission, oldPermissionString, showSelected } = this.state;
    if (showSelected) {
      return false;
    } else {
      return JSON.stringify(permission) === oldPermissionString;
    }
  };

  onChangeSaveBtnStatus = () => {
    this.setState({ showSelected: true });
  };

  render() {
    const { objects, permission, tabs, functions, selected_options, app_authorize } = this.state;
    return (
      <Row>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Button onClick={this.savePermission} type="primary" disabled={this.permissionNotChanged()}>
            保存
          </Button>
          <Button style={{ marginLeft: '2em' }} onClick={this.showPermissionCodes}>
            显示权限编码
          </Button>
        </Col>
        <Col span={24}>
          <Spin spinning={this.state.loading}>
            <Tabs>
              <TabPane tab="对象和字段" key="1">
                <ObjectPermissionTable
                  objects={objects}
                  permission={permission || {}}
                  onObjectPrivilegeCheck={this.onObjectPrivilegeCheck}
                  onFieldPrivilegeCheck={this.onFieldPrivilegeCheck}
                  onChangeConfiguration={this.onChangeConfiguration}
                  onBatchSetField={this.onBatchSetField}
                  defaultValue={selected_options}
                />
              </TabPane>
              <TabPane tab="导航菜单" key="2">
                <TabPermissionTable
                  tabs={tabs}
                  onTabPrivilegeCheck={this.onTabPrivilegeCheck}
                  permission={permission}
                />
              </TabPane>
              <TabPane tab="功能权限" key="3">
                <Row style={{ paddingBottom: '0.5em' }}>
                  <Col span={24} style={{ textAlign: 'right' }}>
                    <Button type="primary" onClick={this.onCreateFunctionPermissionClick.bind(this)}>
                      创建功能权限
                    </Button>
                  </Col>
                </Row>

                <FunctionPermissionForm
                  ref={this.saveFunctionPermissionFormRef}
                  visible={this.state.showFunctionPermissionForm}
                  onOk={this.saveFunctionPermissionHandler}
                  onCancel={() => {
                    this.setState({ showFunctionPermissionForm: false });
                  }}
                />
                <FunctionPermissionTable
                  functions={functions}
                  onFunctionPrivilegeCheck={this.onFunctionPrivilegeCheck}
                  onRowDelete={this.deleteFunctionPermissionHandler}
                  permission={permission}
                />
              </TabPane>
              <TabPane tab="应用权限" key="4">
                <AppAuthorizeTable
                  wrappedComponentRef={(form) => (this.appAuthorizeRefs = form)}
                  tabs={tabs}
                  permission={permission}
                  onChangeSaveBtnStatus={this.onChangeSaveBtnStatus}
                  app_authorize={app_authorize}
                />
              </TabPane>
            </Tabs>
          </Spin>
        </Col>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Button onClick={this.savePermission} type="primary" disabled={this.permissionNotChanged()}>
            保存
          </Button>
          <Button style={{ marginLeft: '2em' }} onClick={this.showPermissionCodes}>
            显示权限编码
          </Button>
        </Col>
      </Row>
    );
  }
}

export default PrivilegeEditor;
