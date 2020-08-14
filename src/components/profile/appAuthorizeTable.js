// AppAuthorizeTable
import React from 'react';
import { Input, Form, Row, Col, Checkbox, Select, Tooltip } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import * as appAuthorize from '../../services/appAuthorize';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;

class AppAuthorizeTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alreadyCheckedApp: [],
      appCheckeOptionsList: [],
      alreadyCheckedAppConfig: [],
      webHomePageState: {},
      phoneTabsList: [],
    };
  }

  componentDidMount() {
    const { app_authorize } = this.props;
    appAuthorize.fetchTabOptionsList({ type: 'app_home_config' }).then((response) => {
      const phoneTabsList = _.get(response, 'data.data.body.items', []);
      if (_.isEmpty(phoneTabsList)) {
        this.setState({
          phoneTabsList: [
            {
              api_name: 'home_config',
              name: '默认首页配置',
              type: 'app_home_config',
            },
          ],
          loading: false,
        });
      } else {
        this.setState({
          phoneTabsList,
          loading: false,
        });
      }
    });

    // 获取 op端app列表
    appAuthorize.fetchAppOptionsList().then((response) => {
      const opAppOptions = _.get(response, 'data.data.body.appAuthorize', []);
      this.setState({
        appCheckeOptionsList: opAppOptions,
      });
    });

    const defaultCheckedApp = [];
    if (_.isEmpty(app_authorize)) {
      // 等于空默认显示crm的默认配置
      defaultCheckedApp.push('CRM');
      this.setState({
        alreadyCheckedAppConfig: [
          {
            appName: 'CRM',
            phoneHomeConfing: 'home_config',
            webHomePageName: '',
            webHomePageType: '1',
            _id: moment().valueOf(),
          },
        ],
        alreadyCheckedApp: defaultCheckedApp,
      });
    } else {
      // 不等于空这是回显已经选中的应用及配置
      _.map(app_authorize, (item) => {
        defaultCheckedApp.push(item.appName);
      });
      this.setState({
        alreadyCheckedApp: defaultCheckedApp,
        alreadyCheckedAppConfig: app_authorize,
      });
    }
  }

  onAppCheckeOptionChange = (checkedValues) => {
    this.props.onChangeSaveBtnStatus();
    const { alreadyCheckedAppConfig } = this.state;
    const newCheckedAppConfig = [];
    _.map(checkedValues, (v) => {
      const oldConfig = _.find(alreadyCheckedAppConfig, (o) => o.appName == v);
      if (oldConfig) {
        newCheckedAppConfig.push(oldConfig);
      } else {
        // 新增
        newCheckedAppConfig.push({
          appName: v,
          _id: moment().valueOf(),
        });
      }
    });
    this.setState({
      alreadyCheckedApp: checkedValues,
      alreadyCheckedAppConfig: newCheckedAppConfig,
    });
  };

  onWebHomePageTypeChange = (item, value) => {
    this.props.onChangeSaveBtnStatus();
    const key = _.get(item, '_id', moment().valueOf());
    const { webHomePageState } = this.state;
    const obj = {};
    if (value == '2') {
      obj.state = true;
    } else {
      obj.state = false;
    }
    webHomePageState[key] = obj;
    this.setState({
      webHomePageState,
    });
  };

  onWebHomePageNameChange = (item, value) => {
    this.props.onChangeSaveBtnStatus();
    console.log(item, value);
  };

  onPhoneHomePageNameChange = (item, value) => {
    this.props.onChangeSaveBtnStatus();
    console.log(item, value);
  };

  onAppAuthorizeSave = () => {
    let handleValues = {};
    const assss = this.props.form.validateFields((err, values) => {
      if (err) {
        return false;
      } else {
        handleValues = this.handleAppAuthorizeValues(values);
      }
    });

    return handleValues;
  };

  handleAppAuthorizeValues = (values) => {
    const cloneValues = _.cloneDeep(values);
    const appAuthorizeArr = [];
    const appAuthorizeValues = [];

    // 根据appAuthorize_标识分组
    const appAuthorizeObj = _.pickBy(cloneValues, (val, key) => {
      return _.includes(key, 'appAuthorize_');
    });

    const otherValuesObj = _.omitBy(cloneValues, (val, key) => {
      return _.includes(key, 'appAuthorize_');
    });

    // 根据key分组
    _.forEach(appAuthorizeObj, (value, key) => {
      const markArr = _.split(key, '_');
      const obj = _.pickBy(appAuthorizeObj, (val, key) => {
        return _.includes(key, markArr[2]);
      });
      if (!_.find(appAuthorizeArr, obj) && !_.isEmpty(obj)) {
        appAuthorizeArr.push(obj);
      }
    });

    // 重新组装数据
    if (!_.isEmpty(appAuthorizeArr)) {
      _.map(appAuthorizeArr, (item) => {
        const appAuthorizeArrItem = {};
        _.forEach(item, (value, key) => {
          const keysArr = _.split(key, '_');
          const newKey = keysArr[1];
          appAuthorizeArrItem[newKey] = value;
          appAuthorizeArrItem['_id'] = +keysArr[2];
          appAuthorizeArrItem.appName = keysArr[3];
        });

        // 补充默认值
        if (!_.has(appAuthorizeArrItem, 'webHomePageName')) {
          appAuthorizeArrItem.webHomePageName = '';
        }

        if (!_.has(appAuthorizeArrItem, 'phoneHomeConfing')) {
          appAuthorizeArrItem.phoneHomeConfing = '';
        }

        appAuthorizeValues.push(appAuthorizeArrItem);
      });
    }

    return {
      app_authorize: appAuthorizeValues,
    };
  };

  renderWebHomePageNameOptions = () => {
    const { tabs, permission } = this.props;
    const options = _.filter(tabs, (o) => {
      return permission[`tab.${o.api_name}`] == 2;
    }).map((ite, index) => {
      const val = _.get(ite, 'api_name', '');
      const name = _.get(ite, 'label', '');
      return (
        <Option value={val} key={index}>
          {name}
        </Option>
      );
    });
    return options;
  };

  renderAppContents = () => {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
    };

    const { tabs } = this.props;
    const { alreadyCheckedAppConfig, webHomePageState, phoneTabsList } = this.state;
    const { getFieldDecorator } = this.props.form;

    return _.map(alreadyCheckedAppConfig, (item) => {
      const appNa = _.get(item, 'appName', '');
      const key = _.get(item, '_id', moment().valueOf());
      return (
        <div
          key={key}
          style={{
            paddingLeft: '20px',
            borderBottom: '1px dashed #ccc',
            marginBottom: '20px',
            paddingBottom: '20px',
            fontSize: '14px',
          }}
        >
          <Row style={{ fontSize: '18px', fontweight: 'bold', paddingBottom: '20px' }}>{`${appNa}权限设置`}</Row>
          <Row style={{ paddingBottom: '20px' }}>首页配置</Row>
          <Row style={{ paddingBottom: '20px' }}>
            <Col lg={14} xl={13}>
              <FormItem
                label={
                  <Tooltip title="web端首页类型">
                    <span style={{ fontSize: '14px', color: '#666' }}>web端首页类型</span>
                  </Tooltip>
                }
                {...formItemLayout}
              >
                {getFieldDecorator(`appAuthorize_webHomePageType_${key}_${appNa}`, {
                  initialValue: _.get(item, 'webHomePageType', '1'),
                  rules: [
                    {
                      required: true,
                      message: '必选项',
                    },
                  ],
                })(
                  <Select
                    onChange={this.onWebHomePageTypeChange.bind(this, item)}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    <Option value="1">默认</Option>
                    <Option value="2">自定义菜单</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col></Col>
          </Row>
          {_.get(webHomePageState, `${key}.state`, _.get(item, 'webHomePageType', '1') == '2') && (
            <Row style={{ paddingBottom: '20px' }}>
              <Col lg={14} xl={13}>
                <FormItem
                  label={
                    <Tooltip title="选择菜单">
                      <span style={{ fontSize: '14px', color: '#666' }}>选择菜单</span>
                    </Tooltip>
                  }
                  {...formItemLayout}
                >
                  {getFieldDecorator(`appAuthorize_webHomePageName_${key}_${appNa}`, {
                    initialValue: _.get(item, 'webHomePageName', ''),
                    rules: [
                      {
                        required: true,
                        message: '必选项',
                      },
                    ],
                  })(
                    <Select
                      onChange={this.onWebHomePageNameChange.bind(this, item)}
                      showSearch
                      optionFilterProp="children"
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    >
                      {this.renderWebHomePageNameOptions()}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col></Col>
            </Row>
          )}
          {appNa == 'CRM' && (
            <Row style={{ paddingBottom: '20px' }}>
              <Col lg={14} xl={13}>
                <FormItem
                  label={
                    <Tooltip title="移动端首页配置">
                      <span style={{ fontSize: '14px', color: '#666' }}>移动端首页配置</span>
                    </Tooltip>
                  }
                  {...formItemLayout}
                >
                  {getFieldDecorator(`appAuthorize_phoneHomeConfing_${key}_${appNa}`, {
                    initialValue: _.get(item, 'phoneHomeConfing', ''),
                    rules: [
                      {
                        required: true,
                        message: '必选项',
                      },
                    ],
                  })(
                    <Select
                      onChange={this.onPhoneHomePageNameChange.bind(this, item)}
                      showSearch
                      optionFilterProp="children"
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    >
                      {_.map(phoneTabsList, (ite, index) => {
                        const val = _.get(ite, 'api_name', '');
                        const name = _.get(ite, 'name', '');
                        return (
                          <Option value={val} key={index}>
                            {name}
                          </Option>
                        );
                      })}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col></Col>
            </Row>
          )}
        </div>
      );
    });
  };

  renderAppOptionTtems = () => {
    const { appCheckeOptionsList } = this.state;
    return _.map(appCheckeOptionsList, (item) => {
      const key = _.get(item, '_id');
      const optionName = _.get(item, 'appName');
      return (
        <Col span={2} key={key}>
          <Checkbox value={optionName} key={key}>
            {optionName}
          </Checkbox>
        </Col>
      );
    });
  };

  render() {
    const { alreadyCheckedApp } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form>
          <Row style={{ paddingLeft: '20px', borderBottom: '1px dashed #ccc', marginBottom: '20px' }}>
            <FormItem label="">
              {getFieldDecorator('checkedApp', {
                initialValue: alreadyCheckedApp,
                rules: [
                  {
                    required: true,
                    message: '至少勾选一个应用',
                  },
                ],
              })(
                <CheckboxGroup style={{ width: '100%' }} onChange={this.onAppCheckeOptionChange}>
                  <Row>{this.renderAppOptionTtems()}</Row>
                </CheckboxGroup>,
              )}
            </FormItem>
          </Row>
          <Row>{this.renderAppContents()}</Row>
        </Form>
      </div>
    );
  }
}

export default Form.create()(AppAuthorizeTable);
