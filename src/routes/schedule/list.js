/**
 * Created by xinli on 06/06/2017.
 */
import React from 'react';
import { connect } from 'dva';
import { hashHistory, routerRedux } from 'dva/router';
import { Table, Button, Popconfirm, Tag } from 'antd';

import styles from '../../styles/list.less';

function handleAddData() {
  hashHistory.push('/schedule/add');
}

const ScheduleList = ({
                   loading,
                   body,
                   dispatch,
                 }) => {
  function editPage(record) {
    const { id, label } = record;
    dispatch(routerRedux.push({
      pathname: '/schedule/edit',
      query: { id },
      state: {
        parentName: label,
      },
    }));
  }

  function delPage(id) {
    dispatch({ type: 'schedule/remove', payload: { id } });
  }

  /**
   * 运行定时任务
   * @param {Long} id 
   */
  function run(id) {
    dispatch({
      type: 'schedule/run',
      payload: {
        id
      }
    })
  }

  /**
   * 禁用
   * @param {Long} id 
   */
  function stop(id) {
    dispatch({
      type: 'schedule/stop',
      payload: {
        id
      }
    })
  }

  const columns = [{
    title: '名称',
    key: 'job_name',
    dataIndex: 'job_name',
  }, {
    title: '任务组',
    dataIndex: 'job_group',
    key: 'job_group',
  }, {
    title: 'API Name',
    dataIndex: 'api_name',
    key: 'api_name',
  }, {
    title: '表达式',
    dataIndex: 'cron',
    key: 'cron',
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (val) => {
      if(val === 0) {
        return '未运行'
      }else if(val === 1) {
        return '正在运行'
      }else if(val === 2) {
        return '禁用'
      }
    }
  }, {
    title: '参数是否持久化',
    dataIndex: 'persistence',
    key: 'persistence',
    render: (val) => {
      return val? '是': '否'
    }
  },{
    title: '标签',
    dataIndex: 'tags',
    key: 'tags',
  }, {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  }, {
    title: '操作',
    key: 'action',
    render: (text, record) => {
      const { status } = record;
      const items = [];
      if(status === 0 || status === 1) {
        items.push((
          <Popconfirm title="确认要禁用此定时任务?" onConfirm={stop.bind(null, record.id)}>
            <a>禁用</a>
          </Popconfirm>
        ))
      }
      if(status === 0) {
        items.push((
          <a onClick={editPage.bind(null, record)}>编辑</a>
        ))

        items.push((
          <Popconfirm title="确认要删除此定时任务?" onConfirm={delPage.bind(null, record.id)}>
            <a>删除</a>
          </Popconfirm>
        ))
      } else if(status === 2) {
        items.push((
          <Popconfirm title="确认要运行此定时任务?" onConfirm={run.bind(null, record.id)}>
            <a>启用</a>
          </Popconfirm>
        ))
      }

      const size = items.length;
      if(size > 1) {
        _.range(0, size - 1).forEach(index => {
          items.splice(2 * index + 1, 0, (
            <span className="ant-divider" />
          ))
        })
      }

      return items;
    }
  }];
  return (
    <div>
      <div className={styles.mybutton}>
        <Button type="primary" onClick={handleAddData}>新建定时任务</Button>
      </div>
      <Table
        rowKey={record => record.id} columns={columns}
        pagination={false}
        dataSource={body} loading={loading}
      />
    </div>
  );
};

function mapStateToProps(state) {
  const { body } = state.schedule;
  return {
    body,
  };
}

export default connect(mapStateToProps)(ScheduleList);
