/* eslint-disable react/no-string-refs */
import React, { Component } from 'react';
import { Button, Row, Col, message } from 'antd';
import prettyJSONStringify from 'pretty-json-stringify';
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/github';
import 'brace/ext/searchbox';
import Style from './layoutEditor.less';

class LayoutEditor extends Component {

  onEditorContentChange = () => {
  }

  onSave = () => {
    const reactAceComponent = this.refs.aceEditor;
    const editor = reactAceComponent.editor;

    let value = JSON.parse(editor.getValue());
    try {
      value = JSON.parse(editor.getValue());
    } catch (e) {
      message.error('格式错误，不是正确的JSON格式');
      return;
    }

    if (this.props.mode === 'new') {
      this.props.dispatch({
        type: 'newLayout/create',
        payload: value,
      });
    }

    if (this.props.mode === 'edit') {
      const id = window.location.hash.match(/^#.*\?id=(\d+)&.+/)[1];
      this.props.dispatch({
        type: 'editLayout/updateLayout',
        payload: {
          ...value,
          id,
        },
      });
    }
  };

  onFormat = () => {
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
  };

  render() {
    const code = prettyJSONStringify(this.props.layout);
    const maxLines = 80;
    const minLines = 50;
    return (
      <div>
        <Row>
          <Col span={24} className={Style.nav_tip}>
            <span>布局内容</span>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <AceEditor
              ref="aceEditor"
              mode="json"
              theme="github"
              name="UNIQUE_ID_OF_DIV"
              onChange={this.onEditorContentChange}
              editorProps={{ $blockScrolling: true }}
              value={code}
              width="100%"
              className={Style.AceEitor}
              maxLines={maxLines}
              minLines={minLines}
            />
          </Col>
        </Row>
        <Row>
          <Col span={4} push={3} className={Style.button}>
            <Button className="ant-btn-primary" onClick={this.onSave} > 保存 </Button>
          </Col>
          <Col span={4} offset={1} className={Style.button}>
            <Button className="ant-btn-primary" onClick={this.onFormat} > 格式化 </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default LayoutEditor;
