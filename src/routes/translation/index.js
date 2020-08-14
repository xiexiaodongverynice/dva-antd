/**
 * Created by xinli on 06/06/2017.
 */
import React from 'react';
import { connect } from 'dva';
import { Table, Popconfirm, Row, Col, Button } from 'antd';
import { Link } from 'react-router';
import { hashHistory } from 'dva/router';

const TranslationList = ({ translations, dispatch }) => {
  const delTranslation = (id) => {
    dispatch({
      type: 'translation_index/deleteTranslation',
      payload: {
        id,
      },
    });
  };
  const addTranslation = () => {
    hashHistory.push('/translation/add');
  };
  const columns = [
    {
      title: 'API_NAME',
      dataIndex: 'api_name',
      key: 'api_name',
    },
    {
      title: '语言',
      dataIndex: 'language',
      key: 'language',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => (
        <span>
          <Link to={{ pathname: '/translation/edit', query: { id: record.id } }}>
            编辑
          </Link>
          <span className="ant-divider" />
          <Link to={{ pathname: '/translation/add', query: { copy: record.id } }}>
            复制
          </Link>
          <span className="ant-divider" />
          <Popconfirm title="确认要删除该语言包?" onConfirm={delTranslation.bind(this, record.id)}>
            <a>删除</a>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 525 }}>

      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            style={{ marginTop: '10px', marginBottom: '10px' }}
            onClick={addTranslation.bind(this)}
          >新建翻译</Button>
        </Col>
      </Row>


      <Row>
        <Col span={24}>
          <Table
            rowKey={record => record.id}
            columns={columns}
            dataSource={translations}
            pagination={false}
          />
        </Col>
      </Row>

    </div>
  );
};

function mapStateToProps(state) {
  const { translations } = state.translation_index;
  return {
    translations,
  };
}

export default connect(mapStateToProps)(TranslationList);
