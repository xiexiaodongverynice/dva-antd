/**
 * Created by xinli on 2017/10/3.
 */

import React, { Component } from 'react';
import { Input, Modal, Table, Row, Col } from 'antd';
import * as userService from '../../services/user';

const Search = Input.Search;

class UserTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: '姓名',
          dataIndex: 'name',
          width: 150,
          render: (text) => {
            return (
              <span>{text}</span>
            );
          },
        }, {
          title: '用户编码',
          dataIndex: 'id',
          width: 150,
        }, {
          title: '电子邮件',
          dataIndex: 'email',
        }, {
          title: '性别',
          dataIndex: 'gender',
        },
      ],
      loading: false,
      dataSource: [],
      showModal: false,
      pagination: {
        showSizeChanger: true,
        showQuickJumper: false,
        showTotal: total => `共 ${total} 条`,
        current: 1,
        total: 0,
        defaultCurrent: 1,
        pageSize: 10,
      },
      nameCriteria: '',
      selectedRowKeys: [],
      selectedRows: [],
    };
  }

  componentWillMount() {
    this.doQuery();
  }

  onPageChange = (pagination) => {
    this.setState({
      pagination,
      loading: true,
    }, () => { this.doQuery(); });
  };

  onSearch = (value) => {
    this.setState({
      nameCriteria: value,
    }, () => { this.doQuery(); });
  };

  onSelectionChange(selectedRowKeys, selectedRows) {
    // const { multipleSelect } = this.state;
    this.setState({
      selectedRowKeys,
      selectedRows,
    }, () => {
      if (this.props.onSelectChange) {
        this.props.onSelectChange(selectedRowKeys, selectedRows);
      }
    });
  }

  doQuery = () => { /* eslint no-unused-vars: [0]*/
    const { pagination: { current, pageSize }, nameCriteria } = this.state;
    userService.query({
      objectApiName: 'user_info',
      joiner: 'and',
      criterias: nameCriteria ? [{ field: 'name', operator: 'contains', value: [nameCriteria] }] : [],
      pageNo: current,
      pageSize,
      orderBy: 'name',
      order: 'desc',
    }).then((response) => {
      const body = response.data.data.body;
      const data = body.result;
      const count = body.resultCount;
      const { pagination: _p } = this.state;
      _p.total = count;
      this.setState({
        dataSource: data,
        pagination: _p,
      });
    });
  };

  render() {
    const { columns, dataSource, pagination, nameCriteria } = this.state;
    const { selectMode } = this.props;
    return (
      <Table
        title={() => {
          return (
            <Row>
              <Col span={18}>
                <Search defaultValue={nameCriteria} onSearch={this.onSearch.bind(this)} />
              </Col>
            </Row>
          );
        }}
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        onChange={this.onPageChange.bind(this)}
        rowSelection={{
          type: selectMode,
          onChange: this.onSelectionChange.bind(this),
        }}
      />
    );
  }
}

/* eslint react/no-multi-comp: [0] */
class UserSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value || '',
      selectedUser: props.defaultUser || {},
      tmpUser: {}, // 临时选中的行，尚未点击确定时
    };
  }

  componentWillReceiveProps(nextProps) {
    const { selectedUser } = this.state;
    // 已经有值了说明不是首次加载
    if (selectedUser.id) {
      return;
    }
    // 给出默认用户则直接使用，否则根据ID查找
    const { defaultUser, value } = nextProps;
    if (defaultUser) {
      this.setState({
        selectedUser: defaultUser,
      });
    } else if (value) {
      userService
        .getUserDetailByUserId({ id: value })
        .then((response) => {
          const selectedUserByResponse = response.data.data.body;
          this.setState({
            selectedUser: selectedUserByResponse,
          });
        });
    }
  }

  onModalOk = () => {
    const { tmpUser } = this.state;
    this.setState({
      value: tmpUser.id,
      selectedUser: tmpUser,
    }, () => {
      const { value } = this.state;
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    });
    this.closeModal();
  };

  onModalClose= () => {
    this.closeModal();
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      tmpUser: selectedRows[0],
    });
  };

  closeModal = () => {
    this.setState({
      showModal: false,
    });
  };

  showModal = () => {
    this.setState({
      showModal: true,
    });
  };

  render() {
    const { showModal, selectedUser } = this.state;
    return (
      <div>
        <Search onSearch={this.showModal.bind(this)} value={selectedUser.name} placeholder="请选择" />
        <Modal
          visible={showModal}
          onOk={this.onModalOk.bind(this)}
          onCancel={this.onModalClose.bind(this)}
        >
          <UserTable
            selectMode="radio"
            onSelectChange={this.onSelectChange.bind(this)}
          />
        </Modal>
      </div>
    );
  }
}

export default UserSelector;
