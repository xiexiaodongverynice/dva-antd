/**
 * Created by xinli on 2017/9/21.
 */
import React from 'react';
import AceEditor from 'react-ace';
import { Row, Col, Select } from 'antd';

// eslint-disable-next-line no-unused-vars
import brace from 'brace';
import 'brace/mode/json';
import 'brace/theme/github';
import 'brace/ext/searchbox';


import Style from './fieldDependencyEditor.less';

class FieldDependencyEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      theme: 'github',
    };
    this.onChange = props.onChange;
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      value: newProps.value,
    });
  }

  onEditorContentChange(value) {
    this.setState({
      value,
    });
    if (this.onChange) {
      this.onChange(value);
    }
  }
  onThemeChange(value) {
    this.setState({
      theme: value,
    });
  }


  render() {
    const { value, theme } = this.state;
    const maxLines = 80;
    const minLines = 50;
    // const themeOptions = ['dawn', 'github', 'twilight', 'textmate'];
    const Option = Select.Option;

    return (
      <div>
        <Row>
          <Col span={24}>
            <AceEditor
              mode="json"
              theme={theme}
              name="UNIQUE_ID_OF_DIV"
              onChange={this.onEditorContentChange.bind(this)}
              editorProps={{ $blockScrolling: true }}
              value={value}
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

export default FieldDependencyEditor;
