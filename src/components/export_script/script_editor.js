/* eslint-disable react/no-string-refs */
import React, { Component } from 'react';
import { Button, Row, Col, message, Form, Select, Input, Switch, Table, Popconfirm, Modal } from 'antd';
import sqlFormatter from 'sql-formatter';
import AceEditor from 'react-ace';
import _ from 'lodash';
import 'brace/mode/sql';
import 'brace/mode/json';
import 'brace/theme/sqlserver';
import 'brace/theme/github';
import 'brace/ext/searchbox';
import prettyJSONStringify from 'pretty-json-stringify';
import Style from '../layout/layoutEditor.less';
import { getNS } from '../../helpers/exportScriptHelper';
import TranslationEditor from '../../routes/translation/TranslationEditor';
import RenderModal from './renderModal';
import * as simpleProfileService from '../../services/simpleProfile';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

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

class ScriptEditor extends Component {
  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
    this.onFormat = this.onFormat.bind(this);
    this.onScriptChange = this.onScriptChange.bind(this);
    this.onLabelChange = this.onLabelChange.bind(this);
  }
  state = { visible: false, initValue: {}, isEdit: false, profileList: [] };

  componentDidMount() {
    this.getProfileList();
  }

  onScriptChange(scripts) {
    const { dispatch, mode } = this.props;
    dispatch({
      type: `${getNS(mode)}/updateScript`,
      payload: {
        scripts,
      },
    });
  }

  onLabelChange(label) {
    const { dispatch, mode } = this.props;
    dispatch({
      type: `${getNS(mode)}/updateScript`,
      payload: {
        label,
      },
    });
  }

  onSave() {
    const reactAceComponent = this.refs.aceEditor;
    const editor = reactAceComponent.editor;
    const { dispatch, mode, form, script } = this.props;
    let scripts;
    try {
      scripts = sqlFormatter.format(editor.getValue());
    } catch (e) {
      message.error('格式错误，不是正确的sql格式');
      return;
    }
    if (scripts.trim() === '') {
      message.error('请填写SQL脚本');
      return;
    }
    /**
     * label没有错误
     */
    const { label } = script;
    if (_.isObject(JSON.parse(label))) {
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (mode === 'new') {
            dispatch({
              type: `${getNS(mode)}/create`,
            });
          } else if (mode === 'edit') {
            dispatch({
              type: `${getNS(mode)}/update`,
            });
          }
        }
      });
    }
  }

  onFormat() {
    const reactAceComponent = this.refs.aceEditor;
    const editor = reactAceComponent.editor;
    try {
      const prettySql = sqlFormatter.format(editor.getValue());
      this.onScriptChange(prettySql);
    } catch (e) {
      message.error('格式错误，不是正确的sql格式');
    }
  }

  onFormatLabel = () => {
    const reactAceComponent = this.refs.labelEditor;
    const editor = reactAceComponent.editor;

    try {
      const prettyJSON = prettyJSONStringify(JSON.parse(editor.getValue()), {
        shouldExpand: (object) => {
          if (Array.isArray(object) && object.length < 3) {
            return false;
          } else {
            return true;
          }
        },
      });
      editor.setValue(prettyJSON);
    } catch (e) {
      message.error('格式错误，不是正确的JSON格式');
    }
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  setNewQuery = () => {
    this.setState({
      visible: true,
      initValue: {},
      isEdit: false,
    });
  };

  addParams = (_params) => {
    const { script } = this.props;
    let { set_params } = script;
    //* _dataSource是提交的数据 先在DataSource里查找有没有key 根据获得的key在dataSource里筛选出唯一的对象 拿提交后的数据替换
    //* 没有key的话 设置key push进入datasource
    _params.api_name = _.trim(_params.api_name);
    if (_params.key) {
      set_params = set_params.filter((item) => item.key !== _params.key);
    } else {
      _.set(_params, 'key', Date.now());
    }
    set_params.push(_params);
    this.setState({
      visible: false,
    });
    this.saveDataSource(set_params);
  };

  saveDataSource = (set_params) => {
    const { dispatch, mode } = this.props;
    dispatch({
      type: `${getNS(mode)}/updateScript`,
      payload: {
        set_params,
      },
    });
  };

  editQuery = (item) => {
    const { mode } = this.props;
    if (mode === 'detail') return;
    if (_.get(item, 'type') === '文本') {
      item.type = 'text_parameter';
    } else if (_.get(item, 'type') === '日期时间') {
      item.type = 'date_time_parameter';
    } else if (_.get(item, 'type') === '列表') {
      item.type = 'list_parameter';
    } else if (_.get(item, 'type') === '多选') {
      item.type = 'select_multiple';
    }
    this.setState({
      visible: true,
      initValue: item,
      isEdit: true,
    });
  };

  deleteQuery = (_params) => {
    const { mode } = this.props;
    if (mode === 'detail') return;
    const { script } = this.props;
    let { set_params } = script;
    set_params = set_params.filter((item) => item.key !== _params.key);
    this.setState({
      visible: false,
    });
    this.saveDataSource(set_params);
  };

  getProfileList = async () => {
    // const { mode } = this.props;
    // if(mode === 'edit' || mode === 'new'){
    const queryDataDeal = {
      // joiner: 'and',
      // criterias: [],
      orderBy: 'name',
      order: 'asc',
      pageNo: 1,
      pageSize: 10000,
      // objectApiName: 'profile',
    };
    const response = await simpleProfileService.getSimpleProfile(queryDataDeal);
    if (response) {
      const profiles = _.get(response, 'data.data.body.result');
      this.setState({
        profileList: profiles,
      });
    }
    // }
  };

  renderOptions = () => {
    const { profileList } = this.state;
    return profileList.map((item) => {
      return <Option key={_.get(item, 'id')}>{_.get(item, 'name')}</Option>;
    });
  };

  handleTableData = () => {
    const { script } = this.props;
    const { set_params } = script;
    const params = _.cloneDeepWith(set_params);
    _.some(params, (item) => {
      if (_.get(item, 'type') === 'text_parameter') {
        item.type = '文本';
      } else if (_.get(item, 'type') === 'date_time_parameter') {
        item.type = '日期时间';
      } else if (_.get(item, 'type') === 'list_parameter') {
        item.type = '列表';
      } else if (_.get(item, 'type') === 'select_multiple') {
        item.type = '多选';
      }
    });
    return params;
  };

  openSystemParamsInfo = () => {
    const columns = [
      {
        title: 'Name',
        width: '33%',
        dataIndex: 'name',
      },
      {
        title: '描述',
        dataIndex: 'describe',
      },
    ];
    const data = [
      {
        key: '1',
        name: 'CURRENT_TENANT',
        describe: '当前租户ID',
      },
    ];

    Modal.info({
      title: 'SQL脚本中，支持的系统参数，配合$$xx$$使用。（目前仅限于业务前端的导出功能）',
      width: 666,
      maskClosable: true,
      content: <Table columns={columns} dataSource={data} />,
      onOk() {},
    });
  };

  render() {
    const { script, form, mode, scriptFirstLoad } = this.props;
    const { getFieldDecorator } = form;
    const { scripts, api_name, remark, name, label, front_end_export, profile, set_params } = script;
    const { profileList } = this.state;
    const columns = [
      {
        title: '参数名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'api_name',
        dataIndex: 'api_name',
        key: 'api_name',
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '是否必填',
        dataIndex: 'required',
        key: 'required',
        render: (text) => {
          let required = '';
          if (text) {
            required = '是';
          } else {
            required = '否';
          }
          return <span>{required}</span>;
        },
      },
      {
        title: '默认值',
        dataIndex: 'default_value',
        key: 'default_value',
      },
      {
        title: '描述',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          const { mode } = this.props;
          return (
            <span>
              <a
                href="JavaScript:;"
                style={{ color: mode === 'detail' ? 'rgba(0, 0, 0, 0.25)' : '' }}
                onClick={() => this.editQuery(record)}
              >
                编辑
              </a>
              &nbsp;&nbsp;
              {mode === 'detail' ? (
                <a style={{ color: 'rgba(0, 0, 0, 0.25)' }} href="JavaScript:;">
                  删除
                </a>
              ) : (
                <Popconfirm
                  placement="topLeft"
                  title={'确认删除？    '}
                  onConfirm={() => this.deleteQuery(record)}
                  okText="确认"
                  cancelText="取消"
                >
                  <a href="JavaScript:;">删除</a>
                </Popconfirm>
              )}
            </span>
          );
        },
      },
    ];
    return (
      <div>
        <Form>
          <Row>
            <Col span={24} className={Style.nav_tip}>
              <span>基本信息</span>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="脚本名称" hasFeedback>
                {getFieldDecorator('name', {
                  initialValue: name,
                  rules: [{ required: true, message: '请输入KPI名称!', whitespace: true }],
                })(<Input disabled={mode === 'edit' || mode === 'detail'} />)}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem {...formItemLayout} label="API_NAME" hasFeedback>
                {getFieldDecorator('api_name', {
                  initialValue: api_name,
                  rules: [{ required: true, message: '请输入API_NAME!', whitespace: true }],
                })(<Input disabled={mode === 'edit' || mode === 'detail'} />)}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="开放业务端导出" hasFeedback>
                {getFieldDecorator('front_end_export', {
                  initialValue: front_end_export,
                  rules: [{ required: true }],
                })(<Switch checked={front_end_export} disabled={mode === 'detail'} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="简档" hasFeedback>
                {getFieldDecorator('profile', {
                  initialValue: profile,
                  rules: [{ required: front_end_export, message: '请选择简档' }],
                })(
                  <Select
                    showSearch
                    mode="multiple"
                    size="default"
                    placeholder="请选择简档"
                    style={{ width: '100%' }}
                    disabled={!front_end_export || mode === 'detail'}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.renderOptions()}
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <FormItem
                {...{
                  labelCol: {
                    xs: { span: 24 },
                    sm: { span: 4 },
                  },
                  wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 18 },
                  },
                }}
                label="脚本描述"
                hasFeedback
              >
                {getFieldDecorator('remark', {
                  initialValue: remark,
                  rules: [{ required: false, whitespace: true }],
                })(<TextArea disabled={mode === 'detail'} />)}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={12} className={Style.nav_tip}>
              <span>参数设置</span>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Button disabled={mode === 'detail'} onClick={this.setNewQuery} type="primary">
                新建参数
              </Button>
              <RenderModal handleCancel={this.handleCancel} mode={mode} {...this.state} addParams={this.addParams} />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Table columns={columns} dataSource={this.handleTableData()} />
            </Col>
          </Row>

          <Row>
            <Col span={22} className={Style.nav_tip}>
              <span>SQL脚本</span>
            </Col>
            <Col span={2} className={Style.nav_tip}>
              <Button onClick={this.openSystemParamsInfo}>系统参数</Button>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <AceEditor
                ref="aceEditor"
                mode="sql"
                theme="sqlserver"
                onChange={this.onScriptChange}
                value={scripts}
                name="UNIQUE_ID_OF_DIV"
                editorProps={{ $blockScrolling: true }}
                width="100%"
                className={Style.AceEitor}
                maxLines={20}
                minLines={20}
                readOnly={mode === 'detail'}
              />
            </Col>
          </Row>

          <Row>
            <Col span={24} className={Style.nav_tip}>
              <span>label映射</span>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <AceEditor
                ref="labelEditor"
                mode="json"
                theme="github"
                name="UNIQUE_ID_OF_DIV"
                onChange={this.onLabelChange.bind(this)}
                editorProps={{ $blockScrolling: true }}
                value={label}
                width="100%"
                className={Style.AceEitor}
                maxLines={20}
                minLines={20}
                readOnly={mode === 'detail'}
              />
            </Col>
          </Row>

          <Row>
            {mode === 'detail' ? null : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 40,
                }}
              >
                <Button
                  className="ant-btn-primary"
                  onClick={this.onSave}
                  style={{
                    marginRight: 10,
                  }}
                >
                  {' '}
                  保存{' '}
                </Button>
                <Button
                  className="ant-btn-primary"
                  onClick={this.onFormat}
                  style={{
                    marginRight: 10,
                  }}
                >
                  {' '}
                  格式化脚本{' '}
                </Button>

                <Button className="ant-btn-primary" onClick={this.onFormatLabel}>
                  {' '}
                  格式化LABEL{' '}
                </Button>
              </div>
            )}
          </Row>
        </Form>
      </div>
    );
  }
}

export default ScriptEditor;
