import React, { Component } from 'react';
import { Modal, Form, Button } from 'antd';
import prettyJSONStringify from 'pretty-json-stringify';
import request from '../../utils/request_custom';
import config from '../../utils/config';
import FieldDependencyEditor from './FieldDependencyEditor';


const { api } = config;
const { custom_objects_all } = api;
const FormItem = Form.Item;

class SetFieldDependencyModal extends Component {

  state = {
    visible: false,
    digitalVisible: false,
    number: 1234,
    type: undefined,
    newKey: new Date(),
    disState: false,
    editDisState: false,
    targetObjects: [],
    currentValue: [],
    fetching: false,
    isVirtual: false,
  };

  componentWillMount=() => {
    this.dealViewState();
  };


  dealViewState = () => {
    const { viewState } = this.props;
    if (viewState === 'add') {
      this.setState({
        disState: false,
        editDisState: false,
      });
    } else if (viewState === 'edit') {
      this.setState({
        disState: false,
        editDisState: true,
      });
    } else if (viewState === 'view') {
      this.setState({
        disState: true,
      });
    }
  };
  showModalHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
    if (this.props.record.target_object_api_name !== undefined) {
      this.fetchObjectList();
    }
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  okHandler = () => {
    /* const { onOk } = this.props;
    const { form } = this.props; */
    this.props.form.validateFields((err, values) => {
      const { record } = this.props;
      if (!err) {
        const { dependencyJSON } = values;
        try {
          const dependency = JSON.parse(dependencyJSON);
          const { onOk } = this.props;
          if (onOk) {
            onOk({ dependency, version: record.version });
            this.hideModelHandler();
          } else {
            console.error('onOk handler not given');
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  fetchObjectList = () => {
    request({
      url: custom_objects_all,
      method: 'get',
      data: {},
    })
      .then(response => response.data)
      .then((items) => {
        const data = items.map(obj => ({
          text: obj.display_name,
          value: obj.api_name,
        }));
        this.setState({ targetObjects: data });
      });
  };


  // select one
  render() {
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { dependency = {} } = this.props.record;
    const dependencyJSON = prettyJSONStringify(dependency);

    return (
      <span>
        <span onClick={this.showModalHandler}>
          { children }
        </span>
        <Modal
          title="设置依赖"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
          width="800px"
          footer={[
            <Button key="back" size="large" onClick={this.hideModelHandler}>返回</Button>,
            <Button key="submit" type="primary" size="large" onClick={this.okHandler} disabled={this.state.disState}>
              提交
            </Button>,
          ]}
        >
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem
              label="设置依赖"
            >
              {getFieldDecorator('dependencyJSON', {
                rules: [{ required: true, message: 'Please input your username!' }],
                initialValue: dependencyJSON,
              })(
                <FieldDependencyEditor />,
              )}
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(SetFieldDependencyModal);

