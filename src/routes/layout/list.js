import React from 'react';
import { connect } from 'dva';
import { Table, Button, Popconfirm, Row, Col, Select } from 'antd';
import { Link } from 'react-router';
import * as objectDescribeService from '../../services/customObjects';

const Option = Select.Option;

class LayoutList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filter: {
        object_describe_api_name: '',
      },
      objects: [],
    };
  }

  componentWillMount() {
    objectDescribeService.fetch({ page: 1 }).then((response) => {
      const objects = response.data;
      this.setState({
        objects,
      });
    });
  }

  onObjectSelect = (value) => {
    const { filter } = this.state;
    filter.object_describe_api_name = value;
    this.setState({
      filter,
    });
  };

  delLayout = (e) => {
    this.props.dispatch({ type: 'layoutList/deleteLayout', payload: { id: e } });
  };

  columns = [
    {
      title: '布局名称',
      key: 'display_name',
      render: (text, record) => (
        <span>{record.display_name}</span>
      ),
    }, {
      title: 'API_NAME',
      key: 'api_name',
      dataIndex: 'api_name',
    }, {
      title: '布局类型',
      dataIndex: 'layout_type',
      key: 'layout_type',
    }, {
      title: '相关的业务对象',
      dataIndex: 'object_describe_api_name',
      key: 'object_describe_api_name',
    }, {
      title: '记录类型',
      dataIndex: 'record_type',
      key: 'record_type',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <Link to={{ pathname: '/layouts/edit', query: { id: record.id }, state: { parentName: record.display_name } }}>
            编辑
          </Link>
          <span className="ant-divider" />
          <Link to={{ pathname: '/layouts/copy', query: { id: record.id }, state: { parentName: record.display_name } }}>
            复制
          </Link>
          <span className="ant-divider" />
          <Link to={{ pathname: '/layouts/scm', query: { id: record.id }, state: { parentName: record.display_name } }}>
            新建版本
          </Link>
          <span className="ant-divider" />
          <Link to={{ pathname: '/layouts/history', query: { id: record.id }, state: { parentName: record.display_name } }}>
            历史版本
          </Link>
          <span className="ant-divider" />
          <Popconfirm title="确认要删除布局?" onConfirm={this.delLayout.bind(this, record.id)}>
            <a>删除</a>
          </Popconfirm>
        </span>
      ),
    }];

  ObjectSelector = () => {
    const { objects } = this.state;
    const options = objects.map(x => (
      <Option key={`obj-${x.api_name}`} value={x.api_name}>{x.display_name}</Option>
    ));
    options.unshift(<Option key="all" value="">全部</Option>);
    return (
      <Select
        defaultValue=""
        placeholder="请选择业务对象"
        style={{ minWidth: 150 }}
        onChange={this.onObjectSelect}
        showSearch
        filterOption={(input, option) => {
          return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        }}
      >
        {options}
      </Select>
    );
  };


  render() {
    const { object_describe_api_name } = this.state.filter;
    const dataSource = this.props.layoutList.filter((x) => {
      return object_describe_api_name ? x.object_describe_api_name === object_describe_api_name : true;
    });
    return (
      <div style={{ marginLeft: 16, marginRight: 16 }} >
        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <Row type="flex" justify="end">
            <Col span={10} style={{ textAlign: 'left' }} >
              {this.ObjectSelector()}
            </Col>
            <Col span={12} />
            <Col span={2}>
              <Link to={{ pathname: '/layouts/new', query: { type: 'add' } }}>
                <Button type="primary" >新建布局</Button>
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
                dataSource={dataSource}
                loading={this.props.loading}
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
  const { layoutList } = state.layoutList;
  // const loading = state.loading.models.layoutList;
  return {
    layoutList,
    // loading,
  };
}

export default connect(mapStateToProps)(LayoutList);
