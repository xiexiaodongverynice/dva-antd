import React from 'react';
import { Radio, Form, Button, Upload, Icon, Input, message } from 'antd';
import styles from './index.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

class architecture extends React.Component {

  state = {
    value1: 'javascript:void(0);',
    value2: 'javascript:void(0);',
    log: '',
  }

  onChange1 = (e) => {
    let url = '';
    if (e.target.value == 'a') {
      url = `https://crmpower-tenant-test.herokuapp.com/rest/download/territory?token=${localStorage.getItem('token')}`;
    }
    if (e.target.value == 'b') {
      url = `https://crmpower-tenant-test.herokuapp.com/rest/download/user_territory?token=${localStorage.getItem('token')}`;
    }
    if (e.target.value == 'c') {
      url = `https://crmpower-tenant-test.herokuapp.com/rest/download/customer_territory?token=${localStorage.getItem('token')}`;
    }
    this.setState({
      value1: url,
    });
  }

  onChange2 = (e) => {
    let url = '';
    if (e.target.value == 'a') {
      url = `https://crmpower-tenant-test.herokuapp.com/rest/upload/territory?token=${localStorage.getItem('token')}`;
    }
    if (e.target.value == 'b') {
      url = `https://crmpower-tenant-test.herokuapp.com/rest/upload/user_territory?token=${localStorage.getItem('token')}`;
    }
    if (e.target.value == 'c') {
      url = `https://crmpower-tenant-test.herokuapp.com/rest/upload/customer_territory?token=${localStorage.getItem('token')}`;
    }
    this.setState({
      value2: url,
    });
  }
  downFile=() => {
    if (this.state.value1 == 'javascript:void(0);') {
      message.error('请选择架构类型!');
      return false;
    }
  }
  upFile=() => {
    if (this.state.value2 == 'javascript:void(0);') {
      message.error('请选择架构类型!');
      return false;
    }
  }
  okHandler = ({ file }) => {
    if (file.response) {
      if (file.response.body.log) {
        this.setState({
          log: file.response.body.log,
        });
      }
    }
  }
  render() {
    const upload = {
      action: this.state.value2,
      headers: {
        authorization: 'authorization-text',
        token: localStorage.getItem('token'),
      },
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
    };

    return (

      <div>
        <h2>导出管理</h2>
        <hr className={styles.hr} />
        <Form>
          <FormItem
            {...formItemLayout}
            label="请选择导出类型："
            hasFeedback
          >
            <RadioGroup onChange={this.onChange1}>
              <RadioButton value="a">架构</RadioButton>
              <RadioButton value="b">用户架构关系</RadioButton>
              <RadioButton value="c">客户架构关系</RadioButton>
            </RadioGroup>

          </FormItem>
          <FormItem
            wrapperCol={{ span: 12, offset: 8 }}
          >
            <Button className={styles.buttonStyle} type="primary">
              <a href={this.state.value1} onClick={this.downFile}>导出</a>
            </Button>
          </FormItem>
        </Form>
        <h2>导入管理</h2>
        <hr className={styles.hr} />
        <Form>
          <FormItem
            {...formItemLayout}
            label="请选择导入类型："
            hasFeedback
          >
            <RadioGroup onChange={this.onChange2}>
              <RadioButton value="a">架构</RadioButton>
              <RadioButton value="b">用户架构关系</RadioButton>
              <RadioButton value="c">客户架构关系</RadioButton>
            </RadioGroup>

          </FormItem>
          <FormItem
            {...formItemLayout}
            label="请选择文件："
            hasFeedback
          >
            <Upload {...upload} onChange={this.okHandler} beforeUpload={this.upFile}>
              <Button>
                <Icon type="upload" /> Click to Upload
              </Button>
            </Upload>
          </FormItem>
        </Form>

        <Form>
          <FormItem
            {...formItemLayout}
            label="导入异常日志："
            hasFeedback
          >
            <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} value={this.state.log} />
          </FormItem>
        </Form>
      </div>);
  }
}


export default architecture;
