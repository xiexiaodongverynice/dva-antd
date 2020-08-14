import React from 'react';
import { connect } from 'dva';
import { Table, Button, Popconfirm, Row, Col, Select } from 'antd';
import { Link } from 'react-router';
import { getKpiTypeByValue } from '../../helpers/kpiDefHelper';
import { formatTimeFull } from '../../utils/date';

const Option = Select.Option;

class KPIDefList extends React.Component {

  delLayout = (e) => {
    this.props.dispatch({ type: 'kpi_def_list/deleteItem', payload: { id: e } });
  };

  columns = [
    {
      title: '名称',
      key: 'kpi_name',
      dataIndex: 'kpi_name',
    },
    {
      title: 'API_NAME',
      key: 'api_name',
      dataIndex: 'api_name',
    }, {
      title: 'KPI类型',
      dataIndex: 'kpi_type',
      key: 'kpi_type',
      render: getKpiTypeByValue,
    }, {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: 150,
      render: formatTimeFull,
      sorter: true,
    }, {
      title: '最后操作时间',
      dataIndex: 'update_time',
      key: 'update_time',
      width: 150,
      render: formatTimeFull,
      sorter: true,
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        const linkProps = {query: { id: record.id }, state: { parentName: record.api_name } };
        return (
          <span>
            <Link to={{ pathname: '/kpi_def/view', ...linkProps}}>
              查看
            </Link>
            <span className="ant-divider" />
            <Link to={{ pathname: '/kpi_def/edit', ...linkProps}}>
              编辑
            </Link>
            <span className="ant-divider" />
            <Link to={{ pathname: '/kpi_def/copy', ...linkProps}}>
              复制
            </Link>
            <span className="ant-divider" />
            <Link to={{ pathname: '/kpi_def/assign', ...linkProps}}>
              分配
            </Link>
            <span className="ant-divider" />
            <Popconfirm title="确认要删除KPI定义?" onConfirm={this.delLayout.bind(this, record.id)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    }
  ];

  render() {

    const { list, loading } = this.props;

    return (
      <div style={{ marginLeft: 16, marginRight: 16 }} >
        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <Row type="flex" justify="end">
            <Col span={10} style={{ textAlign: 'left' }} >
            </Col>
            <Col span={12} />
            <Col span={2}>
              <Link to={{ pathname: '/kpi_def/new', query: { type: 'add' } }}>
                <Button type="primary" >新建</Button>
              </Link>
            </Col>
          </Row>
        </div>
        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <Row type="flex" justify="start">
            <Col span={24}>
              <Table
                columns={this.columns}
                pagination={false}
                dataSource={list}
                loading={loading}
                rowKey="id"
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  const { list } = state.kpi_def_list;
  // const loading = state.loading.models.layoutList;
  return {
    list,
    // loading,
  };
}

export default connect(mapStateToProps)(KPIDefList);
