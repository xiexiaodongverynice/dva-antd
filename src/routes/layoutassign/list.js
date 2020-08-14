import React from 'react';
import { connect } from 'dva';
import { Table, Button, Popconfirm, Row, Col, Select } from 'antd';
import { Link } from 'react-router';
import * as objectDescribeService from '../../services/customObjects';
import * as profileService from '../../services/simpleProfile';
import MetadataImporter from '../../components/common/MetadataImporter';
import styles from './list.less';

const Option = Select.Option;

class LayoutAssignList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filter: {
        profile: '',
        object_describe_api_name: '',
      },
      objects: [],
      profiles: [],
    };
  }

  componentWillMount() {
    objectDescribeService.fetch({ page: 1 }).then((response) => {
      const objects = response.data;
      this.setState({
        objects,
      });
    });
    profileService.getSimpleProfile({ pageSize: 100, pageNo: 1 })
      .then((response) => {
        if (response.data.data.body) {
          const { result: profiles } = response.data.data.body;
          this.setState({ profiles });
        }
      });
  }


  onObjectSelect = (value) => {
    const { filter } = this.state;
    filter.object_describe_api_name = value;
    this.setState({
      filter,
    });
  };

  onProfileChange = (value) => {
    const { filter } = this.state;
    filter.profile = value;
    this.setState({
      filter,
    });
  };

  onUploadSuccess = () => {
    this.props.dispatch({
      type: 'layout_assign_list/fetch',
      payload: {},
    });
  };

  delLayout = (e) => {
    this.props.dispatch({ type: 'layout_assign_list/deleteItem', payload: { id: e } });
  };

  ObjectSelector = () => {
    const { objects } = this.state;
    const options = objects.map(x => (
      <Option key={`obj-${x.api_name}`} value={x.api_name}>{x.display_name}</Option>
    ));
    return (
      <Select placeholder="请选择业务对象" style={{ minWidth: 150 }} onChange={this.onObjectSelect} showSearch optionFilterProp="children" >
        {options}
      </Select>
    );
  };

  ProfileSelector = () => {
    const { profiles } = this.state;
    const options = profiles.map(x => (
      <Option key={`obj-${x.id}`} value={x.name}>{x.name}</Option>
    ));
    return (
      <Select placeholder="请选择简档" style={{ minWidth: 150, marginRight: 10 }} onChange={this.onProfileChange} showSearch >
        {options}
      </Select>
    );
  };

  render() {
    const columns = [
      {
        title: '布局名称',
        key: 'layout_name',
        render: (text, record) => (
          <span>{record.layout_name}</span>
        ),
      }, {
        title: '布局API Name',
        dataIndex: 'layout_api_name',
        key: 'layout_api_name',
      }, {
        title: '简档',
        dataIndex: 'profile',
        key: 'profile',
      },{
        title: '简档API_NAME',
        dataIndex: 'profile_api_name',
        key: 'profile_api_name',
      }, {
        title: 'API_NAME',
        dataIndex: 'api_name',
        key: 'api_name',
      }, {
        title: '业务对象',
        dataIndex: 'object_describe_api_name',
        key: 'object_describe_api_name',
      }, {
        title: '记录类型',
        dataIndex: 'record_type',
        key: 'record_type',
      }, {
        title: '布局类型',
        dataIndex: 'layout_type',
        key: 'layout_type',
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Link to={{ pathname: '/layout_assign/edit', query: { id: record.id }, state: { parentName: record.layout_name } }}>
              编辑
            </Link>
            <span className="ant-divider" />
            <Popconfirm title="确认要删除布局分配?" onConfirm={this.delLayout.bind(this, record.id)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];
    const { profile, object_describe_api_name } = this.state.filter;
    const dataSource = this.props.list.filter((x) => {
      return profile ? x.profile === profile : true;
    }).filter((x) => {
      return object_describe_api_name ? x.object_describe_api_name === object_describe_api_name : true;
    });
    return (
      <div style={{ marginLeft: 16, marginRight: 16 }} >
        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <Row type="flex" justify="end">
            <Col span={12} style={{ textAlign: 'left' }} >
              {this.ProfileSelector()}
              {this.ObjectSelector()}
            </Col>
            <Col span={12} style={{ textAlign: 'right' }} className={styles.scope_upload}>
              <MetadataImporter
                label="导入布局分配"
                metadataType="layoutAssign"
                onUploadSuccess={this.onUploadSuccess.bind(this)}
              />
              <Link to={{ pathname: '/layout_assign/add', query: { type: 'add' } }} style={{ marginLeft: 10 }}>
                <Button type="primary" >新建布局分配</Button>
              </Link>
            </Col>
          </Row>
        </div>
        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <Row type="flex" justify="start">
            <Col span={24}>
              <Table
                rowKey={record => record.id} columns={columns}
                pagination={false}
                dataSource={dataSource}
                loading={this.props.loading}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  const { list } = state.layout_assign_list;
  return {
    list,
  };
}

export default connect(mapStateToProps)(LayoutAssignList);
