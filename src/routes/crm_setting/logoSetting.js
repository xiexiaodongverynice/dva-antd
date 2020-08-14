import React from 'react';
import { connect } from 'dva';
import { Form, Upload, Icon, message } from 'antd';

const FormItem = Form.Item;
const Dragger = Upload.Dragger;

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

const LogoSetting  = ({ dispatch, data, uploadLogoUrl }) => {

  const beforeUpload = (file) => {
    if(file.size > 50 * 1024){
      message.warn('上传的文件大小不能超过50kb');
      return false;
    }
    if(!/\.png$/.test(file.name) || file.type !== 'image/png'){
      message.warn('上传的文件格式必须为PNG');
      return false;
    }
    return true;
  };

  const props = {
    name: 'file',
    multiple: false,
    showUploadList: true,
    action: uploadLogoUrl,
    headers: {
      authorization: 'authorization-text',
      token: localStorage.getItem('token'),
    },
    onChange(info) {
      if (info.file.response) {
        const res = info.file.response;
        const { head: { code, msg } } = res;
        if (code === 200) {
          message.info('上传成功!');
          dispatch({
            type: 'logo_setting/fetch',
          });
        } else if (code === 500 || code === 403) {
          message.error(`${info.file.name} 错误信息：${msg}`);
        }
      }
    },
  };

  return (
    <div>
      <h2>导入管理</h2>
      <hr style={{marginBottom: 40}}/>
      <Form>
        <FormItem {...formItemLayout} label="请选择文件：" hasFeedback>
          <Dragger {...props} beforeUpload={beforeUpload}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">点击此处或将文件拖拽到这里上传</p>
            <p className="ant-upload-hint">支持单文件和多文件上传</p>
          </Dragger>
        </FormItem>
      </Form>

      <h2>当前LOGO</h2>
      <hr style={{marginBottom: 40}}/>

      {
        data.value? (
          <div style={{display: 'flex', height: 'auto', width: '100%', justifyContent: 'center'}}>
            <img alt="logo" src={`data:image/png;base64,${data.value}`} style={{backgroundColor: 'darkcyan'}}/>
          </div>
        ): null
      }

    </div>
  );
};

export default connect(({logo_setting})=>{
  const { data, uploadLogoUrl } = logo_setting;
  return {
    data,
    uploadLogoUrl,
  };
})(Form.create()(LogoSetting));
