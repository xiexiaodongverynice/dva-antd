import React from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Form, Select } from 'antd';

import Style from './alertSetting.less';
import { locales } from '../../utils/constants';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 16 },
  },
};


class LanguageSetting extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      language_setting: {},
    };
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {
    const { language_setting } = nextProps;
    this.setState({
      language_setting,
    });
  }

  onSave = () => {
    const { dispatch, form } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { value } = values;
        const { language_setting } = this.state;
        dispatch({
          type: 'crm_language_setting/saveOrUpdate',
          payload: { ...language_setting, value, api_name: 'default_language' },
        });
      }
    });
  };

  render() {
    const { language_setting } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { value } = language_setting;
    const languageOptions = locales.map(locale =>
      <Option key={locale.key} value={locale.key}>{locale.key} {locale.value}</Option>,
    );
    return (
      <div>
        <Row>
          <Col span={24} className={Style.nav_tip}>
            <span>默认语言设置</span>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form>
              <FormItem
                {...formItemLayout}
                label="语言"
              >
                {getFieldDecorator('value', {
                  initialValue: value,
                  rules: [{ required: true, message: '请选择语言' }],
                })(
                  <Select showSearch>
                    {languageOptions}
                  </Select>,
                )}
              </FormItem>
            </Form>

          </Col>
        </Row>
        <Row>
          <Col span={4} push={3} className={Style.button}>
            <Button className="ant-btn-primary" onClick={this.onSave} > 保存 </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { language_setting } = state.crm_language_setting;
  return {
    language_setting,
  };
}

export default connect(mapStateToProps)(Form.create()(LanguageSetting));
