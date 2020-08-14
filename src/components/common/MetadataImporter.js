/**
 * Created by xinli on 2017/10/3.
 */
import React, { Component } from 'react';
import { Upload, Button, Icon, message } from 'antd';
import { config } from '../../utils';

// noinspection JSAnnotator
const { api: { metadata_upload }, baseURL } = config;

class MetadataImporter extends Component {

  constructor(props) {
    super(props);
    const { metadataType } = props;
    this.state = {
      metadataType,
    };
  }

  render() {
    const { metadataType } = this.state;
    const token = localStorage.getItem('token');
    const { label, onUploadSuccess } = this.props;

    const props = {
      name: 'file',
      action: `${baseURL}/${metadata_upload}${metadataType}?token=${token}`,
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          // console.log(info);
          const { insertsize, failedsize, total } = info.file.response.body;
          if (failedsize > 0) {
            message.warn(`部分数据导入失败! 共${total}条, 其中导入成功${insertsize}条，失败${failedsize}条`, 5);
          } else {
            message.success(`全部数据导入成功! 共${total}条, 其中导入成功${insertsize}条，失败${failedsize}条`, 5);
          }
          if (onUploadSuccess) {
            onUploadSuccess();
          }
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 上传失败!`);
        }
      },
    };
    return (
      <Upload {...props}>
        <Button>
          <Icon type="upload" /> {label}
        </Button>
      </Upload>
    );
  }
}
export default MetadataImporter;
