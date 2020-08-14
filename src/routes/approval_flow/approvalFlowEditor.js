/**
 * Created by xinli on 2017/9/21.
 */
import React from 'react';
import AceEditor from 'react-ace';
import { Row, Col, Select } from 'antd';
import prettyJSONStringify from 'pretty-json-stringify';
import yaml from 'js-yaml';
import _ from 'lodash';

// eslint-disable-next-line no-unused-vars
import brace from 'brace';
import 'brace/mode/json';
import 'brace/mode/yaml';
import 'brace/theme/github';
import 'brace/theme/dawn';
import 'brace/theme/textmate';
import 'brace/theme/twilight';
import 'brace/ext/searchbox';

import Style from './approvalFlowEditor.less';

class ApprovalFlowEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
    this.onChange = props.onChange;
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      value: newProps.value,
    });
  }

  onEditorContentChange(editorContent) {
    try {
      const { value } = this.state;
      value.content = editorContent;

      this.setState({
        value,
      }, () => {
        if (this.onChange) {
          this.onChange(value);
        }
      });
    } catch (error) {
      // console.error(error);
    }
  }

  onFormatChange(newFormat) {
    const value = this.state.value;
    const tmp = this.evalContentToObject();
    value.format = newFormat;
    const contentInNewFormat = this.getEditorContent(newFormat, tmp);
    const newValue = {
      format: newFormat,
      content: contentInNewFormat,
    };
    this.setState({
      value: newValue,
    }, () => {
      if (this.onChange) {
        this.onChange(newValue);
      }
    });
  }

  getEditorContent(format, value) {
    if (value === undefined || value === null) {
      return '';
    }
    if (_.isString(value)) {
      return value;
    }
    if (_.isObject(value)) {
      let editorContent;
      if (format === 'json') {
        editorContent = prettyJSONStringify(value || {});
      }
      if (format === 'yaml') {
        editorContent = yaml.safeDump(value || {});
      }
      return editorContent;
    }
    return '';
  }

  evalContentToObject() {
    const { value: { format, content } } = this.state;
    if (format === 'json') {
      return JSON.parse(content);
    }
    if (format === 'yaml') {
      return yaml.safeLoad(content);
    }
  }
  render() {
    const { value: { content, format } } = this.state;

    const editorContent = content;
    // console.dir(yaml);
    // console.log(yaml.dump(value || {}));
    const maxLines = 80;
    const minLines = 50;
    const formatOptions = ['json', 'yaml'];
    const Option = Select.Option;
    return (
      <div>
        <Row style={{ padding: '5px' }}>
          <Col span={4}>
            <Select placeholder="选择格式" onChange={this.onFormatChange.bind(this)} defaultValue={format}>
              {formatOptions.map(x => <Option key={x} value={x}>{x}</Option>)}
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <AceEditor
              mode={format}
              theme="github"
              name="UNIQUE_ID_OF_DIV"
              onChange={this.onEditorContentChange.bind(this)}
              editorProps={{ $blockScrolling: true }}
              value={editorContent}
              width="100%"
              className={Style.AceEitor}
              maxLines={maxLines}
              minLines={minLines}
            />
          </Col>
        </Row>
      </div>

    );
  }
}

export default ApprovalFlowEditor;
