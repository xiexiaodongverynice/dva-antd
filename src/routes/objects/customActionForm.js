/**
 * Created by xinli on 06/06/2017.
 */
import React from 'react';
import { hashHistory } from 'dva/router';
import { Button, Form } from 'antd';
import prettyJSONStringify from 'pretty-json-stringify';
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/github';

import styles from './form.less';
import Style from '../../components/layout/layoutEditor.less';

const FormItem = Form.Item;

class CustomActionInput extends React.Component {
  constructor(props) {
    super(props);

    const value = this.props.value || {};
    this.state = {
      value,
      json: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      if (this.props.value !== nextProps.value) {
        const value = nextProps.value;
        const { json } = this.state;
        this.setState({
          value,
          json: json || prettyJSONStringify(value),
        });
      }
    }
  }

  onEditorContentChange = (content) => {
    try {
      const value = JSON.parse(content);
      this.setState({
        value,
        json: content,
      });
      this.triggerChange(value);
    } catch (e) {

    }
  };

  triggerChange = (newValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, newValue));
    }
  };


  render() {
    const { json } = this.state;

    return (
      <AceEditor
        ref="customActionEditor"
        mode="json"
        theme="github"
        name="UNIQUE_ID_OF_DIV"
        onChange={this.onEditorContentChange}
        editorProps={{ $blockScrolling: true }}
        value={json}
        width="100%"
        className={Style.AceEitor}
        maxLines={200}
        minLines={20}
      />
    );
  }
}

const CustomAction = Form.create()(CustomActionInput);


class CustomActionForm extends React.Component {

  constructor() {
    super();
    this.state = {
      contentInvalid: false,
    };
  }

  okHandler = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'custom_action/update',
          payload: {
            object: Object.assign({}, this.props.object, values),
          },
        });
      }
    });
  };
  goBack = () => {
    hashHistory.push('/customObjects');
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { actions } = this.props.object;
    const { contentInvalid } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    return (
      <div>
        <h3 className={styles.myH3}>设置自定义Action</h3>
        <Form>
          <FormItem
            {...formItemLayout}
            label="Actions"
            hasFeedback
          >
            {getFieldDecorator('actions', {
              initialValue: actions,
              rules: [{ required: false, message: '' }],
            })(
              <CustomAction
                rows={20}
              />,
            )}
          </FormItem>

          <FormItem
            wrapperCol={{ span: 12, offset: 8 }}
          >
            <Button className={styles.buttonStyle} type="primary" onClick={this.okHandler} disabled={contentInvalid}>保存</Button>
            <Button className={styles.buttonStyle} onClick={this.goBack}>返回列表</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(CustomActionForm);
