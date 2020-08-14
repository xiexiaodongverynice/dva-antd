import React, { Component } from 'react';
import { Tree, Tabs, Table, Button, Modal, Radio } from 'antd';
import { toArray } from '../../utils';

const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;

function fieldValue(str, record) {
  let result = 1;
  if (str != undefined && str != '') {
    const json = toArray(str);
    if (json) {
      for (let i = 0; i < json.length; i++) {
        if (record.object_describe_id == json[i].obj_id) {
          if (!json[i].obj_field.length == 0) {
            const jsonFields = toArray(json[i].obj_field);
            for (let j = 0; j < jsonFields.length; j++) {
              if (jsonFields[j].field_name == record.api_name) {
                switch (jsonFields[j].field_value) {
                  case 2:
                    result = 1;
                    break;
                  case 4:
                    result = 2;
                    break;
                  case 8:
                    result = 3;
                    break;
                  default:
                    break;
                }
              }
            }
          }
        }
      }
    }
  }
  return result;
}

class RoleSimpleProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      newKey: 1,
    };
  }


  onCheck = (checkedKeys) => {
    this.props.dispatch({ type: 'group_add/onCheck', payload: { checkedKeys } });
  }
  onExpand = (expandedKeys) => {
    this.props.dispatch({ type: 'group_add/onExpand', payload: { expandedKeys, autoExpandParent: true } });
  }
  // 打开
  showModal = (e) => {
    this.props.dispatch({
      type: 'group_add/field',
      payload: { data_obj: this.props.data_obj, objectId: e.id },
    });
    this.setState({ visible: true });
  }
  // 关闭
  handleCancel = () => {
    this.setState({ visible: false, newKey: Math.random(), objectFieldList: [] });
  }
  // 对象保存按钮
  handleSave = () => {
    this.props.dispatch({
      type: 'group_add/obj_add',
      payload: { checkedKeys: this.props.checkedKeys, data_obj: this.props.data_obj },
    });
  }

  // 字段保存按钮
  handleOk = () => {
    this.props.dispatch({
      type: 'group_add/field_add',
      payload: { data_obj: this.props.data_obj },
    });
    this.setState({ visible: false, newKey: Math.random(), objectFieldList: [] });
  }

  handleSelect = (record, e) => {
    this.props.dispatch({
      type: 'group_add/onChecks',
      payload: {
        record,
        field_value: Math.pow(2, e.target.value),
        data_obj: this.props.data_obj,
        objectList: this.props.objectList,
      },
    });
  }

  render() {
    const columns = [{
      dataIndex: 'display_name',
      key: 'display_name',
      render: (text, record) => {
        return (
          <span>{record.display_name}</span>
        );
      },
    }, {
      dataIndex: 'objType',
      key: 'objType',
      render: (text, record) => {
        return (
          <Button icon="export" onClick={this.showModal.bind(null, record)} />
        );
      },
    }];
    const popColumns = [{
      title: '字段名称',
      dataIndex: 'api_name',
      key: 'api_name',
    }, {
      title: '字段类型',
      dataIndex: 'type',
      key: 'type',
    }, {
      dataIndex: 'role',
      key: 'role',
      title: '字段权限',
      render: (text, record) => {
        return (
          <div>
            <RadioGroup
              onChange={this.handleSelect.bind(null, record)}
              value={fieldValue(this.props.data_obj.permission, record)}
            >
              <Radio value={1} disabled={this.props.location.pathname == '/group/group_see'}>禁止访问</Radio>
              <Radio value={2} disabled={this.props.location.pathname == '/group/group_see'}>只读访问</Radio>
              <Radio value={3} disabled={this.props.location.pathname == '/group/group_see'}>完全控制</Radio>
            </RadioGroup>
          </div>
        );
      },
    }];
    const role_table = { margin: '10px 10px' };
    const savdButton = { display: 'none' };
    const savdButtons = {};
    const pop_div = { width: '600px', margin: '20px' };
    const isButton = [
      <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
      <Button key="submit" type="primary" size="large" onClick={this.handleOk}>
        保存
      </Button>,
    ];
    const roleChildren = this.props.objectList.map((obj) => {
      return (<TreeNode
        title={obj.display_name} key={obj.id}
        disabled={this.props.location.pathname == '/group/group_see'}
      >
        <TreeNode
          title="新增" key={`${obj.id}-1-${obj.api_name}`}
          disabled={this.props.location.pathname == '/group/group_see'}
        />
        <TreeNode
          title="编辑" key={`${obj.id}-2-${obj.api_name}`}
          disabled={this.props.location.pathname == '/group/group_see'}
        />
        <TreeNode
          title="查看" key={`${obj.id}-3-${obj.api_name}`}
          disabled={this.props.location.pathname == '/group/group_see'}
        />
        <TreeNode
          title="删除" key={`${obj.id}-4-${obj.api_name}`}
          disabled={this.props.location.pathname == '/group/group_see'}
        />
        <TreeNode
          title="列表" key={`${obj.id}-5-${obj.api_name}`}
          disabled={this.props.location.pathname == '/group/group_see'}
        />
        <TreeNode
          title="导入" key={`${obj.id}-6-${obj.api_name}`}
          disabled={this.props.location.pathname == '/group/group_see'}
        />
        <TreeNode
          title="导出" key={`${obj.id}-7-${obj.api_name}`}
          disabled={this.props.location.pathname == '/group/group_see'}
        />
      </TreeNode>
      );
    });
    return (
      <Tabs>
        <TabPane tab="功能权限" key="1">
          <Tree
            checkable
            onCheck={this.onCheck}
            onExpand={this.onExpand}
            autoExpandParent={this.props.autoExpandParent}
            checkedKeys={this.props.checkedKeys}
            expandedKeys={this.props.expandedKeys}
          >
            {roleChildren}
          </Tree>
          <Button style={this.props.location.pathname == '/group/group_see' ? savdButton : savdButtons}onClick={this.handleSave}>保存</Button>
        </TabPane>
        <TabPane tab="字段使用" key="2">
          <h3>标准业务对象</h3>
          <Table
            rowKey={record => record.id} showHeader={false} pagination={false} columns={columns} style={role_table}
            dataSource={this.props.objectList}
          />

          <Modal
            width="660px" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}
            key={this.state.newKey}
            footer={this.props.location.pathname == '/group/group_see' ?
                   null : isButton

                 }
          >
            <div style={pop_div}>
              <Table
                rowKey={record => record.id} pagination={false} columns={popColumns} style={role_table}
                dataSource={this.props.objectFieldList} bordered
                loading={this.props.loading}
              />
            </div>
          </Modal>
        </TabPane>
      </Tabs>

    );
  }
}

export default RoleSimpleProfile;
