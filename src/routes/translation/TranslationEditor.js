/**
 * Created by xinli on 2017/9/21.
 */
import React from 'react';
import AceEditor from 'react-ace';
import { Row, Col } from 'antd';

// eslint-disable-next-line no-unused-vars
import brace from 'brace';
import 'brace/mode/properties';
import 'brace/theme/github';

import Style from './translationEditor.less';
import { getAnnotations } from '../../helpers/propertiesHelper';

const translationTemplate = `
# 注释
key=value
`;

class TranslationEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || translationTemplate,
      theme: 'github',
      annotations: [],
    };
    this.onChange = props.onChange;
    this.onValidate = props.onValidate;
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    this.setState({
      value,
    });
  }

  onEditorContentChange(value) {
    const annotations = getAnnotations(value);
    this.setState({
      value,
      annotations,
    }, () => {
      if (this.onChange) {
        this.onChange(value);
      }

      if (this.onValidate) {
        this.onValidate(annotations.length > 0);
      }
    });
  }
  onThemeChange(value) {
    this.setState({
      theme: value,
    });
  }


  render() {
    const { value, theme, annotations } = this.state;
    const maxLines = 80;
    const minLines = 50;
    return (
      <div>
        <Row>
          <Col span={24}>
            <AceEditor
              mode="properties"
              theme={theme}
              name="UNIQUE_ID_OF_DIV"
              onChange={this.onEditorContentChange.bind(this)}
              editorProps={{ $blockScrolling: true }}
              value={value}
              width="100%"
              className={Style.AceEitor}
              maxLines={maxLines}
              minLines={minLines}
              annotations={annotations}
            />
          </Col>
        </Row>
      </div>

    );
  }
}

export default TranslationEditor;
