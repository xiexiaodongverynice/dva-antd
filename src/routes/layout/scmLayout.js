import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Row, Col, Input, Button } from 'antd';
import { Diff2Html } from 'diff2html'
import 'diff2html/src/ui/css/diff2html.css';

const ScmLayout = ({ dispatch, recentlyCommit, diffResult, description, location }) => {

  const descriptionChange = (event) => {
    dispatch({
      type: 'layoutScm/assignState',
      payload: {
        description: event.target.value.replace(/[^\w\u4e00-\u9fa5]/img, ''), // 特殊字符无效
      }
    })
  };

  const newScm = () => {
    dispatch({
      type: 'layoutScm/new',
      payload: {
        parentName: location.state.parentName,
      },
    });
  };

  return (
    <div>

      <Row>
        <Col span={12}>
          <Input placeholder="备注信息" value={description} onChange={descriptionChange} maxLength={50} />
        </Col>
        <Col span={2}>
          <Button type="primary" onClick={newScm} style={{marginLeft: 10}}>保存变更</Button>
        </Col>
      </Row>

      <h2 style={{color: 'darkcyan', marginBottom: 10, marginTop: 10}}>与最近版本的对比结果:</h2>
      <Row>
        {
          _.isEmpty(diffResult)? '无': (
            <div dangerouslySetInnerHTML={{__html: diffResult? Diff2Html.getPrettyHtml(diffResult, {inputFormat: 'diff', showFiles: false, matching: 'lines',outputFormat: 'side-by-side'}): ''}}>
            </div>
          )
        }
      </Row>
    </div>
  );

};

function mapStateToProps(state) {
  const { recentlyCommit, diffResult, layout, description } = state.layoutScm;
  const loading = state.loading.models.layoutScm;
  return {
    recentlyCommit,
    diffResult,
    layout,
    description,
    loading,
  };
}

export default connect(mapStateToProps)(ScmLayout);
