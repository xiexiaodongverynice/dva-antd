/* eslint-disable react/no-string-refs */
import React, { Component } from 'react';
import { Button, Row, Col, message, Form, Select, Input } from 'antd';
import prettyJSONStringify from 'pretty-json-stringify';
import AceEditor from 'react-ace';
import _ from 'lodash';
import 'brace/mode/json';
import 'brace/theme/github';
import 'brace/ext/searchbox';
import Style from '../layout/layoutEditor.less';
import { getNS, kpiTypeDicts } from '../../helpers/kpiDefHelper';

const FormItem = Form.Item;
const { Option } = Select;

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

class KPIEditor extends Component {

  constructor(props){
    super(props);
    this.onSave = this.onSave.bind(this);
    this.onFormat = this.onFormat.bind(this);
    this.onEditorContentChange = this.onEditorContentChange.bind(this);
  }

  onEditorContentChange(definition){
    const { dispatch, mode } = this.props;
    dispatch({
      type: `${getNS(mode)}/updateKpiDef`,
      payload: {
        definition,
      },
    });
  }

  onSave(){
    const reactAceComponent = this.refs.aceEditor;
    const editor = reactAceComponent.editor;
    const { dispatch, mode } = this.props;
    let definition;
    try {
      definition = JSON.parse(editor.getValue());
    } catch (e) {
      message.error('格式错误，不是正确的JSON格式');
      return;
    }
    dispatch({
      type: `${getNS(mode)}/save`,
    });
  }

  onFormat(){
    const reactAceComponent = this.refs.aceEditor;
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
  }

  render() {
    const { kpiDef, form, mode } = this.props;
    const { getFieldDecorator } = form;
    const { definition, api_name, kpi_type, kpi_name } = kpiDef;
    const maxLines = 80;
    const minLines = 50;

    let code;
    try{
      if(_.isObject(definition)){
        code = prettyJSONStringify(definition);
      }else{
        code = definition;
      }
    }catch(error){
      code = definition;
      console.error(error);
    }
    return (
      <div>
        <Form>
          <Row>
            <Col span={24} className={Style.nav_tip}>
              <span>KPI内容</span>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <FormItem
                {...formItemLayout}
                label="名称"
                hasFeedback
              >
                {getFieldDecorator('kpi_name', {
                  initialValue: kpi_name,
                  rules: [{ required: true, message: '请输入KPI名称!', whitespace: true }],
                })(
                  <Input disabled={mode === 'edit' || mode === 'view'}/>,
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="API_NAME"
                hasFeedback
              >
                {getFieldDecorator('api_name', {
                  initialValue: api_name,
                  rules: [{ required: true, message: '请输入API_NAME!', whitespace: true }],
                })(
                  <Input disabled={mode === 'edit' || mode === 'view'}/>,
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="KPI类型"
                hasFeedback
              >
                {getFieldDecorator('kpi_type', {
                  initialValue: kpi_type,
                  rules: [{ required: true, message: '请输入KPI类型!'}],
                })(
                  <Select disabled={mode === 'view'}>
                    {
                      kpiTypeDicts.map(item => {
                        return (
                          <Option value={item.value}>
                            {
                              item.text
                            }
                          </Option>
                        );
                      })
                    }
                  </Select>,
                )}
              </FormItem>

              {
                mode === 'view'? null: (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Button className="ant-btn-primary" onClick={this.onSave} style={{
                      marginRight: 10,
                    }}> 保存 </Button>
                    <Button className="ant-btn-primary" onClick={this.onFormat} > 格式化 </Button>
                  </div>
                )
              }

            </Col>
            <Col span={14}>
            <AceEditor
              ref="aceEditor"
              mode="json"
              theme="github"
              onChange={this.onEditorContentChange}
              value={code}
              name="UNIQUE_ID_OF_DIV"
              editorProps={{ $blockScrolling: true }}
              width="100%"
              className={Style.AceEitor}
              maxLines={maxLines}
              minLines={minLines}
              readOnly={mode === 'view'}
            />
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default KPIEditor;
