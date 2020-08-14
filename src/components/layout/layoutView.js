/* eslint-disable react/no-string-refs */
import React, { Component } from 'react';
import { Button, Row, Col, message } from 'antd';
import prettyJSONStringify from 'pretty-json-stringify';
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/github';
import 'brace/ext/searchbox';
import Style from './layoutEditor.less';

class LayoutView extends Component {

  render() {
    const code = prettyJSONStringify(this.props.layout);
    const maxLines = 50;
    const minLines = 10;
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
              editorProps={{ $blockScrolling: true }}
              value={code}
              readOnly={true}
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

export default LayoutView;
