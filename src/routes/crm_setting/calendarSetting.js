import React from 'react';
import { connect } from 'dva';
import { Row, Col, Button, message } from 'antd';
import prettyJSONStringify from 'pretty-json-stringify';
import brace from 'brace';  /* eslint no-unused-vars:[0] */
import 'brace/mode/json';
import 'brace/theme/github';
import 'brace/ext/searchbox';
import AceEditor from 'react-ace';
import Style from './alertSetting.less';

const maxLines = 80;
const minLines = 50;
class CalendarSetting extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      calendar_setting: {},
    };
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {
    const { calendar_setting } = nextProps;
    this.setState({
      calendar_setting,
    });
  }

  onSave = () => {
    const reactAceComponent = this.refs.aceEditor;  /* eslint react/no-string-refs: [0] */
    const editor = reactAceComponent.editor;
    const { dispatch } = this.props;
    const { calendar_setting } = this.state;

    try {
      JSON.parse(editor.getValue());
      const newSetting = Object.assign({}, calendar_setting, { value: editor.getValue() });
      dispatch({
        type: 'crm_calendar_setting/saveOrUpdate',
        payload: newSetting,
      });
    } catch (ex) {
      message.error('格式错误，不是正确的JSON格式');
    }
  };

  onFormat = () => {
    const reactAceComponent = this.refs.aceEditor;  /* eslint react/no-string-refs: [0] */
    const editor = reactAceComponent.editor;

    try {
      const prettyJSON = prettyJSONStringify(JSON.parse(editor.getValue()), {
        shouldExpand: (object, level, key) => {
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
    const { calendar_setting } = this.props;
    const { value } = calendar_setting;
    return (
      <div>
        <Row>
          <Col span={24} className={Style.nav_tip}>
            <span>日历设置</span>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <AceEditor
              ref="aceEditor"                 /* eslint react/no-string-refs: [0] */
              className={Style.AceEitor}
              mode="json"
              theme="github"
              value={value}
              width="100%"
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
            <Button className="ant-btn" onClick={this.onFormat} > 格式化 </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { calendar_setting } = state.crm_calendar_setting;
  return {
    calendar_setting,
  };
}

export default connect(mapStateToProps)(CalendarSetting);
