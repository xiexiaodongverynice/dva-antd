import React from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Button,
  Form,
  Input,
  Checkbox,
  Alert,
  AutoComplete,
  Table,
  Tag,
  Tabs,
  Transfer,
  message,
} from 'antd';
import Style from './index.less';
import * as loginService from '../../services/login';

const FormItem = Form.Item;
// const CheckboxGroup = Checkbox.Group;
const TabPane = Tabs.TabPane;
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
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 6,
    },
  },
};
const syncOptions = [
  { label: '业务对象', value: 'object_describe' },
  { label: '布局', value: 'layout' },
  { label: '简档', value: 'profile' },
  { label: 'KPI定义', value: 'kpi' },
  // { label: 'KPI分配', value: 'kpi_assign' },
  { label: '序列', value: 'sequence' },
  { label: '翻译控制台', value: 'translation' },
  { label: '布局分配', value: 'layout_assign' },
  { label: 'Action脚本', value: 'action_script' },
  { label: '触发器', value: 'trigger' },
  { label: '导航菜单', value: 'tab' },
  { label: '租户设置', value: 'tenant_setting' },
  { label: '功能权限', value: 'function_permission' },
  { label: '审批流', value: 'approval_flow' },
  // { label: '审批流分配', value: 'approval_flow_assign' },
];
const mockDataObj = {};
let targetKeysObj = {};
class MetadataSyncForm extends React.Component {
  componentWillMount() {
    targetKeysObj = {};
    const { dispatch } = this.props;
    dispatch({
      type: 'metadata_sync/hidesync',
      payload: {},
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        const obj = values;
        this.setState({ isshowsnyc: false });
        for (const key in targetKeysObj) {
          if (targetKeysObj[key].length == 0) {
            delete targetKeysObj[key];
          }
        }
        if (JSON.stringify(targetKeysObj) == '{}') {
          return message.error('请选择同步数据进行同步！');
        } else {
          obj.sync = targetKeysObj;
          dispatch({
            type: 'metadata_sync/sync',
            payload: obj,
          });
        }
      }
    });
  };
  state = {
    isshowsnyc: false,
    isgetdata: true,
    mockData: [],
    targetKeys: [],
    activeKey: '',
    syncOptions,
    params: {},
    currentTab: '',
    mockDataall: {},
    token: '',
    appServer: '',
  };
  // *同步数据穿梭框赋值
  getMock = (objectList) => {
    const targetKeys = [];
    const mockData = [];
    for (let i = 0; i < objectList.length; i++) {
      if (objectList[i].api_name) {
        let name = `${objectList[i].display_name}${objectList[i].api_name}`;
        if (
          this.state.currentTab == 'profile' ||
          this.state.currentTab == 'action_script' ||
          this.state.currentTab == 'approval_flow'
        ) {
          name = `${objectList[i].name}${objectList[i].api_name}`;
        }
        if (this.state.currentTab == 'sequence' || this.state.currentTab == 'tab') {
          name = `${objectList[i].label}${objectList[i].api_name}`;
        }
        if (this.state.currentTab == 'translation') {
          name = `${objectList[i].language}${objectList[i].api_name}`;
        }
        if (this.state.currentTab == 'function_permission') {
          name = `${objectList[i].function_name}${objectList[i].api_name}`;
        }
        if (this.state.currentTab == 'layout_assign') {
          name = `${objectList[i].layout_name}${objectList[i].api_name}`;
        }
        if (this.state.currentTab == 'tenant_setting') {
          name = objectList[i].api_name;
        }
        const data = {
          key: objectList[i].api_name.toString(),
          title: name,
          description: `description of ${name}`,
        };
        mockData.push(data);
      }
    }
    const mockDatatab = this.state.currentTab;
    mockDataObj[mockDatatab] = mockData;
    const obj = Object.assign({}, mockDataObj);
    this.setState({ mockData, targetKeys, mockDataall: obj });
  };

  filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;
  // *穿梭框同步数据选择
  handleChange = (targetKeys) => {
    // console.log('targetKeys',targetKeys);
    const tab = this.state.currentTab;
    targetKeysObj[tab] = targetKeys;
    const obj = Object.assign({}, targetKeysObj);
    this.setState({ targetKeys, params: obj });
  };
  handleSearch = (dir, value) => {
    console.log('search:', dir, value);
  };
  // *选取不同不同tab页获取调取不同接口
  callback = (key) => {
    this.setState({
      currentTab: key,
    });
    const { dispatch } = this.props;
    dispatch({
      type: `metadata_sync/${key}`,
      payload: { token: this.state.token, url: this.state.appServer },
      callback: (res) => {
        this.getMock(res);
      },
    });
  };
  // *获取上游用户token请求同步数据
  login = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        loginService.login(values).then((response) => {
          if (response.data.head.code === 200) {
            const { dispatch } = this.props;
            const token = response.data.head.token;
            this.setState({ token, appServer: values.appServer }, () => {
              dispatch({
                type: 'metadata_sync/object_describe',
                payload: { token, url: values.appServer },
                callback: (response) => {
                  this.setState({ isgetdata: false, currentTab: 'object_describe' }, () => {
                    this.getMock(response);
                  });
                },
              });
            });
            message.success('拉取同步数据成功！');
          } else {
            message.error(response.data.head.msg);
          }
        });
      }
    });
  };
  // *重置条件按钮
  conditionalreset = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'metadata_sync/hidesync',
      payload: {},
    });
    this.setState({ isgetdata: true });
    targetKeysObj = {};
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const upstreamLoginServers = [
      // 'http://localhost:8090',
      'https://dev-sso.crmpower.cn',
      'https://stg-sso.crmpower.cn',
    ];
    const upstreamAppServers = [
      // 'http://localhost:8080',
      'https://dev-tm.crmpower.cn',
      'https://stg-tm.crmpower.cn',
    ];
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="上游租户环境的登录服务地址" hasFeedback>
          {getFieldDecorator('loginServer', {
            rules: [
              {
                required: true,
                message: '请输入上游租户的登陆服务地址',
              },
            ],
          })(<AutoComplete disabled={!this.state.isgetdata} dataSource={upstreamLoginServers} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="上游租户的应用服务地址" hasFeedback>
          {getFieldDecorator('appServer', {
            rules: [
              {
                required: true,
                message: '请输入上游租户的应用服务地址',
              },
            ],
          })(<AutoComplete disabled={!this.state.isgetdata} dataSource={upstreamAppServers} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="上游租户的管理员账号" hasFeedback>
          {getFieldDecorator('loginName', {
            rules: [
              {
                required: true,
                message: '请输入登录上游租户的账号',
              },
            ],
          })(<Input disabled={!this.state.isgetdata} placeholder="请输入登录上游租户的账号" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="上游租户的管理员密码" hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入登录上游租户的密码',
              },
            ],
          })(<Input disabled={!this.state.isgetdata} type="password" placeholder="请输入登录上游租户的密码" />)}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" disabled={!this.state.isgetdata} onClick={this.login}>
            拉取同步数据
          </Button>
          <Button type="primary" className={Style.button} onClick={this.conditionalreset}>
            重置条件
          </Button>
        </FormItem>
        {this.state.isgetdata ? (
          ''
        ) : (
          <FormItem {...formItemLayout} label="同步项目">
            {getFieldDecorator('sync', {
              // rules: [{
              //   required: true, message: '请选择要同步的项目',
              // }],
            })(
              <Tabs defaultActiveKey={this.state.activeKey} onChange={this.callback}>
                {this.state.syncOptions.map((pane) => {
                  return (
                    <TabPane tab={pane.label} key={pane.value}>
                      <Transfer
                        dataSource={mockDataObj[pane.value]}
                        showSearch
                        listStyle={{
                          width: 280,
                          height: 280,
                        }}
                        titles={['可选择', '已选择']}
                        filterOption={this.filterOption}
                        targetKeys={targetKeysObj[pane.value]}
                        onChange={this.handleChange}
                        onSearch={this.handleSearch}
                        render={(item) => item.title}
                      />
                    </TabPane>
                  );
                })}
              </Tabs>,
            )}
          </FormItem>
        )}
        {this.state.isgetdata ? (
          ''
        ) : (
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              同步
            </Button>
          </FormItem>
        )}
      </Form>
    );
  }
}

const MetadataSyncFormWrapper = Form.create()(MetadataSyncForm);

const SyncResult = ({ item, result }) => {
  const dataSource = [
    {
      key: `${item}_sync_result`,
      created: result.created,
      updated: result.updated,
      failed: result.failed,
    },
  ];

  const columns = [
    {
      title: `新建 ${result.created.length} 条`,
      dataIndex: 'created',
      key: 'created',
      width: '33%',
      render: (text, record) => {
        const items = record.created.map((x) => (
          <li>
            <Tag key={x}>{x}</Tag>
          </li>
        ));
        return <ul>{items}</ul>;
      },
    },
    {
      title: `更新 ${result.updated.length} 条`,
      dataIndex: 'updated',
      key: 'updated',
      width: '33%',
      render: (text, record) => {
        const items = record.updated.map((x) => (
          <li>
            <Tag key={x}>{x}</Tag>
          </li>
        ));
        return <ul>{items}</ul>;
      },
    },
    {
      title: `失败 ${result.failed.length} 条`,
      dataIndex: 'failed',
      key: 'failed',
      width: '33%',
      render: (text, record) => {
        const items = record.failed.map((x) => (
          <li>
            <Tag key={x}>{x}</Tag>
          </li>
        ));
        return <ul>{items}</ul>;
      },
    },
  ];

  return (
    <Table
      key={`result_table_${item}`}
      bordered
      size="small"
      dataSource={dataSource}
      columns={columns}
      pagination={false}
    />
  );
};
const TotalSyncResult = ({ syncResult }) => {
  const totalResult = syncResult.map((x) => (
    <TabPane
      tab={syncOptions.find((y) => y.value === Object.keys(x.syncItem)[0]).label}
      key={`tab_pane_${Object.keys(x.syncItem)[0]}`}
    >
      <SyncResult key={Object.keys(x.syncItem)[0]} item={x.syncItem} result={x.result} />
    </TabPane>
  ));
  return syncResult.length === 0 ? null : (
    <div>
      <Row>
        <Col
          span={24}
          className={Style.nav_tip}
          style={{ padding: '8px 48px 8px 16px', borderBottom: 'solid 1px #ececec' }}
        >
          <span>同步结果</span>
        </Col>
      </Row>
      <Row>
        <Col span={24} className={Style.nav_tip}>
          <Tabs>{totalResult}</Tabs>
        </Col>
      </Row>
    </div>
  );
};

const MetadataSyncIndex = ({ dispatch, syncResult }) => {
  return (
    <div>
      <Row>
        <Col span={24} className={Style.nav_tip}>
          <Alert
            message="说明"
            description="使用元数据同步，将会帮助您将另一个租户，（我们称之为上游租户，上游租户不一定和当前租户在同一套环境上）上配置的元数据信息，同步到当前租户。
            您可以首先在上游租户上进行配置和脚本开发，配置完成并通过验证后，利用此功能将配置同步到当前租户。"
            type="info"
          />
        </Col>
      </Row>
      <Row>
        <Col span={24} className={Style.nav_tip}>
          <Alert
            message="注意"
            description="同步之后上游租户的元数据配置将覆盖当前租户的配置，并且目前尚未实现自动回滚功能"
            type="warning"
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <MetadataSyncFormWrapper dispatch={dispatch} />
        </Col>
      </Row>

      <TotalSyncResult syncResult={syncResult} />
    </div>
  );
};
// *获取props里面的数据
function mapStateToProps(state) {
  const { syncResult } = state.metadata_sync;
  // const loading = state.loading.models.layoutList;
  return {
    syncResult,
    // loading,
  };
}

export default connect(mapStateToProps)(MetadataSyncIndex);
