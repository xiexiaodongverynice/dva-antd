/**
 * Created by xinli on 06/06/2017.
 */
import React from 'react';
import { hashHistory } from 'dva/router';
import { Button, Form, Input, Checkbox } from 'antd';
import Style from '../../components/layout/layoutEditor.less';
import styles from './form.less';
import prettyJSONStringify from 'pretty-json-stringify';
import AceEditor from 'react-ace';
import _ from 'lodash';
import 'brace/mode/json';
import 'brace/theme/github';

const FormItem = Form.Item;

const ADD_PAGE = '/schedule/add';
const EDIT_PAGE = '/schedule/edit';

class ScheduleForm extends React.Component {


  componentWillMount() {
  }

  okHandler = () => {
    const { schedule, dispatch, location, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (location.pathname === ADD_PAGE) {
          dispatch({ type: 'schedule/create', payload: Object.assign({}, schedule, values) });
        }
        if (location.pathname === EDIT_PAGE) {
          dispatch({ type: 'schedule/update', payload: { schedule: Object.assign({}, schedule, values) } });
        }
      }
    });
  };
  goBack = () => {
    hashHistory.push('/schedule');
  };

  onEditorContentChange = (param) => {
    const { dispatch } = this.props;
    dispatch({
      type: `schedule/assignSchedule`,
      payload: {
        param,
      },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { job_name, job_group, api_name, remark, script, persistence, param, tags, cron } = this.props.schedule;
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
    const isEditMode = this.props.location.pathname === EDIT_PAGE;

    const maxLines = 10;
    const minLines = 3;

    let code;
    try{
      if(_.isObject(param)){
        code = prettyJSONStringify(param);
      }else{
        code = param;
      }
    }catch(error){
      code = param;
      console.error(error);
    }

    return (
      <div>
        <h3 className={styles.myH3}>{isEditMode ? '修改定时任务脚本' : '新建定时任务脚本'}</h3>
        <Form>
          <FormItem
            {...formItemLayout}
            label="名称"
            hasFeedback
          >
            {getFieldDecorator('job_name', {
              initialValue: job_name,
              rules: [{ required: true, message: '请输入任务名称!', whitespace: true }],
            })(
              <Input />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="任务组名称"
            hasFeedback
          >
            {getFieldDecorator('job_group', {
              initialValue: job_group,
              rules: [{ required: true, message: '请输入任务组名称!', whitespace: true }],
            })(
              <Input />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="API_NAME"
            hasFeedback
          >
            {getFieldDecorator('api_name', {
              initialValue: api_name,
              rules: [{ required: true, message: '请输入API Name!', whitespace: true }],
            })(
              <Input disabled={isEditMode} />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="表达式"
            hasFeedback
          >
            {getFieldDecorator('cron', {
              initialValue: cron,
              rules: [{ required: true, message: '请输入表达式!', whitespace: true }],
            })(
              <Input />,
            )}
          </FormItem>
          <FormItem
            labelCol={{
              xs: { span: 24 },
              sm: { span: 2, pull: 1 },
            }}
            wrapperCol={{
              xs: { span: 24 },
              sm: { span: 22, pull: 1 },
            }}
            label="参数是否持久化"
            hasFeedback
          >
            {getFieldDecorator('persistence', {
              initialValue: persistence,
            })(
              <Checkbox/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="脚本运行依赖参数"
            hasFeedback
          >
            {getFieldDecorator('param', {
              initialValue: code,
            })(
              <AceEditor
                mode="json"
                theme="github"
                onChange={this.onEditorContentChange}
                name="UNIQUE_ID_OF_DIV"
                editorProps={{ $blockScrolling: true }}
                width="100%"
                className={Style.AceEitor}
                maxLines={maxLines}
                minLines={minLines}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="标签"
            hasFeedback
          >
            {getFieldDecorator('tags', {
              initialValue: tags,
            })(
              <Input disabled={isEditMode} />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="描述"
            hasFeedback
          >
            {getFieldDecorator('remark', {
              initialValue: remark,
              rules: [{ required: false, message: '' }],
            })(
              <Input.TextArea rows={2} />,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="脚本"
            hasFeedback
          >
            {getFieldDecorator('script', {
              initialValue: script,
              rules: [{ required: false, message: '' }],
            })(
              <Input.TextArea rows={20} style={{ fontFamily: 'monospace' }} />,
            )}
          </FormItem>

          <FormItem
            wrapperCol={{ span: 12, offset: 8 }}
          >
            <Button className={styles.buttonStyle} type="primary" onClick={this.okHandler}>保存</Button>
            <Button className={styles.buttonStyle} onClick={this.goBack}>返回列表</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(ScheduleForm);
