/**
 * Created by xinli on 2017/12/8.
 */
import React, { Component } from 'react';
import { Form, Button, Select } from 'antd';
import { hashHistory } from 'dva/router';
import TranslationEditor from './TranslationEditor';
import styles from './form.less';
import { locales } from '../../utils/constants';

const FormItem = Form.Item;
const TRANSLATION_ADD = '/translation/add';
const TRANSLATION_EDIT = '/translation/edit';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 20, pull: 19 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

const Option = Select.Option;
class TranslationForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  onSave = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { api_name } = values;
        const language = locales.find(x => x.key === api_name).value;
        if (this.props.location.pathname === TRANSLATION_ADD) {
          this.props.dispatch({ type: 'translation_add/create', payload: { ...values, language } });
        }
        if (this.props.location.pathname === TRANSLATION_EDIT) {
          const { translation } = this.props;
          this.props.dispatch({ type: 'translation_edit/update', payload: { ...translation, ...values, language } });
        }
      }
    });
  };

  onValidate = (hasError) => {
    this.setState({
      hasError,
    });
  };

  goBack = () => {
    hashHistory.push('/translation');
  };
  render() {
    const { translation } = this.props;
    const { api_name, resource } = translation;
    const { getFieldDecorator } = this.props.form;
    const { hasError } = this.state;
    const isEditMode = this.props.location.pathname === TRANSLATION_EDIT;
    const languageOptions = locales.map(locale =>
      <Option key={locale.key} value={locale.key}>{locale.key} {locale.value}</Option>,
    );
    return (
      <div style={{ textAlign: 'left' }}>
        <Form>
          <FormItem
            {...formItemLayout}
            label="语言"
          >
            {getFieldDecorator('api_name', {
              initialValue: api_name,
              rules: [{ required: true, message: '请选择语言' }],
            })(
              <Select showSearch disabled={isEditMode}>
                {languageOptions}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="翻译内容"
          >
            {getFieldDecorator('resource', {
              initialValue: resource,
              rules: [{ required: true, message: '' }],
            })(
              <TranslationEditor
                onValidate={this.onValidate}
              />,
            )}
          </FormItem>
        </Form>
        <FormItem
          wrapperCol={{ span: 12, offset: 8 }}
        >
          <Button disabled={hasError} className={styles.buttonStyle} type="primary" onClick={this.onSave}>保存</Button>
          <Button className={styles.buttonStyle} onClick={this.goBack}>返回列表</Button>
        </FormItem>
      </div>
    );
  }
}

export default Form.create()(TranslationForm);
