import React from 'react';
import { Timeline, Collapse, Button, Checkbox, Tooltip, Row, Modal } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import { Diff2Html } from 'diff2html';
import { formatTimeFull } from '../../utils/date';
import LayoutView from '../../components/layout/layoutView';
import 'diff2html/src/ui/css/diff2html.css';

const HistoryLayout = ({ list = [], dispatch, diffResult, newCommit, oldCommit, visible, modalStatus }) => {

  const onCheckboxChange = (values = []) => {
    values = _.orderBy(values, ['time'], ['desc']).map(item => item.id);
    if(values.length >= 1){
      if(values.length === 1){
        values.unshift('');
      }
      dispatch({
        type: 'layoutHistory/assignState',
        payload: {
          newCommit: values[0],
          oldCommit: values[1],
        }
      });
    }else{
      dispatch({
        type: 'layoutHistory/assignState',
        payload: {
          newCommit: '',
          oldCommit: '',
        }
      })
    }
  };

  const checkboxDisabledProps = (commit) => {
    const props = {
      disabled: true,
    }
    if(!_.isEmpty(newCommit) && !_.isEmpty(oldCommit)){
      if(commit.id !== newCommit && commit.id !== oldCommit){
        return props;
      }
    }
  }

  const rollback = (commit) => {
    return () => {
      const { id } = commit;
      dispatch({
        type: 'layoutHistory/fetchCommitDiffEnsure',
        payload: {
          oldCommit: id,
          commitName: id,
        }
      });
    }
  };

  const rollbackEnsure = () => {
    dispatch({
      type: 'layoutHistory/rollback',
    });
  }

  const collapseChange = (commit, activeKey) => {
    if(!_.isUndefined(activeKey) && _.isUndefined(commit.content)){
      dispatch({
        type: 'layoutHistory/showFileByCommit',
        payload: {
          commitName: commit.id,
        },
      });
    }
  }

  const diff = () => {
    if(oldCommit){
      dispatch({
        type: 'layoutHistory/fetchCommitDiff',
      });
    }
  }

  const handleCancel = () => {
    dispatch({
      type: 'layoutHistory/assignState',
      payload: {
        visible: false
      }
    })
  }

  const handleOk = () => {
    dispatch({
      type: 'layoutHistory/assignState',
      payload: {
        visible: false
      }
    })
  }

  return (
    <div>
      <Row style={{marginBottom: 10}}>
        <Button type="primary" onClick={diff} style={{marginRight: 10}}>比较</Button>
        <Tooltip title="选择两个版本进行比较，若只选择一个，则与当前数据库中的配置进行比较">
          <span>Tip</span>
        </Tooltip>
      </Row>
      <Checkbox.Group style={{ width: '100%' }} onChange={onCheckboxChange}>
        {
          _.isEmpty(list)? (
            <h3>
              当前无任何历史记录
            </h3>
          ): list.map(commit => {
            return (
              <Timeline.Item color={'green'}>
                <p>
                  {
                    `hash: ${commit.id}`
                  }
                  <Checkbox value={commit} style={{marginLeft: 20}} {...checkboxDisabledProps(commit)}/>
                </p>
                <p>
                  {
                    `time: ${formatTimeFull(parseInt(commit.time + '000'))}`
                  }
                </p>
                {
                  _.chain(_.get(commit, 'comment', {})).toPairs().map(item => {
                    return (
                      <p key={Math.random()}>
                        {
                          `${item[0]}: ${item[1]}`
                        }
                      </p>
                    )
                  }).value()
                }
                <Collapse accordion onChange={collapseChange.bind(null, commit)}>
                  <Collapse.Panel header="文件内容" key="1">
                    {
                      commit.content? (
                        <LayoutView layout={JSON.parse(commit.content)} dispatch={dispatch} />
                      ): null
                    }
                  </Collapse.Panel>
                </Collapse>
                <p style={{marginTop: 5}}>
                  <Button type="primary" onClick={rollback(commit)}>回滚此版本</Button>
                </p>
              </Timeline.Item>
            );
          })
        }
      </Checkbox.Group>

      <Modal
        title="对比结果"
        visible={visible}
        width={1200}
        onOk={modalStatus === 'view'? handleOk: rollbackEnsure}
        okText={modalStatus === 'view'? '关闭': '确定回滚'}
        onCancel={handleCancel}
      >
        {
          _.isEmpty(diffResult)? '无': (
            <div dangerouslySetInnerHTML={{__html: diffResult? Diff2Html.getPrettyHtml(diffResult, {inputFormat: 'diff', showFiles: false, matching: 'lines',outputFormat: 'side-by-side'}): ''}}>
            </div>
          )
        }
      </Modal>
    </div>
  );
}

function mapStateToProps(state) {
  const { list, diffResult, newCommit, oldCommit, visible, modalStatus } = state.layoutHistory;
  const loading = state.loading.models.layoutHistory;
  return {
    list,
    diffResult,
    newCommit,
    oldCommit,
    visible,
    modalStatus,
    loading,
  };
}

export default connect(mapStateToProps)(HistoryLayout);
