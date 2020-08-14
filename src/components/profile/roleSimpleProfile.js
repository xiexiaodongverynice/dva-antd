import React, { Component } from 'react';
import { Tree, Tabs, Table, Button, Modal, Radio } from 'antd';

const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;

function fieldValue(json, record) {
  let result = 1;
  for (let i = 0; i < json.length; i += 1) {
    if (record.object_describe_id === json[i].obj_id) {
      // const jsonFields = eval(`(${json[i].obj_field})`);
      const jsonFields = toArray(json[i].obj_field);
      if (jsonFields !== undefined) {
        for (let j = 0; j < jsonFields.length; j += 1) {
          if (jsonFields[j].field_name === record.api_name) {
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
  return result;
}

/**
 * undefined => []
 * JSON String => parse
 * Array => obj
 * default => []
 * @param obj
 * @returns {*}
 */
const toArray = (obj) => {
  if (obj === undefined) {
    return [];
  }
  if (Array.isArray(obj)) {
    return obj;
  }
  if (typeof obj === 'string' || obj instanceof String) {
    try {
      return JSON.parse(obj);
    } catch (e) {
      return [];
    }
  }
  return [];
};


class RoleSimpleProfile extends Component {
  constructor(props) {
    super(props);
    // 角色
    this.state = {
      visible: false,
      newKey: 1,
      permissonStr: [],
      fields: [],
    };
  }

  /** ******************************对象权限******************************************************/
  onCheck = (checkedKeys) => {
    let permissonUpdate = [];// 最终更新的数组
    const permissonNew = []; // 页面选择的数组
    const permissonStr = this.props.permissonStr;// 即存的数组
    // 去掉重复
    const distinct = new Set();
    checkedKeys.forEach((o) => {
      const temp = o.split('-');
      distinct.add(temp[0]);
    });
    // 获得页面选择的对象权限集合
    distinct.forEach((id) => {
      let obj_id = '';
      let obj_name = '';
      let obj_value = 0;
      // 计算权限的集合
      checkedKeys.forEach((r) => {
        const record = r.split('-');
        if (record[0] === id && record[1] !== undefined) {
          obj_id = id;
          obj_value += Math.pow(2, record[1]);
          obj_name = record[2];
        }
      });
      const obj = { obj_id, obj_name, obj_value, obj_field: '[]' };
      permissonNew.push(obj);
    });
    // 既存对象权限没有的场合
    if (permissonStr.length === 0) {
      permissonUpdate = permissonNew;
    } else {
      // 帅选页面和既存对象
      for (let i = 0; i < permissonStr.length; i++) {
        let objFlg = true;
        for (let j = 0; j < permissonNew.length; j++) {
          // 页面和既存都有的时候，对象放入更新数组中并且更新既存的权限
          if (permissonStr[i].obj_id === permissonNew[j].obj_id) {
            objFlg = false;
            permissonStr[i].obj_name = permissonNew[j].obj_name;
            permissonStr[i].obj_value = permissonNew[j].obj_value;
            permissonUpdate.push(permissonStr[i]);
          }
        }
        // 页面没有既存有的时候，首先判断是否包含字段权限，如果包含字段权限放入更新数组中，反之则不放入
        if (objFlg) {
          if (permissonStr[i].obj_field !== undefined) {
            const objFields = toArray(permissonStr[i].obj_field);
            if (objFields.length > 0) {
              permissonStr[i].obj_value = 0;
              permissonUpdate.push(permissonStr[i]);
            }
          }
        }
      }
      // 页面有既存没有的时候，直接放入更新数组
      for (let i = 0; i < permissonNew.length; i++) {
        let objFlg = true;
        for (let j = 0; j < permissonUpdate.length; j++) {
          if (permissonUpdate[j].obj_id === permissonNew[i].obj_id) {
            objFlg = false;
          }
        }
        if (objFlg) {
          permissonUpdate.push(permissonNew[i]);
        }
      }
    }
    this.props.dispatch({ type: 'roleProfile/objectFlesh', payload: { nodes: checkedKeys, permissonStr: permissonUpdate } });
  }
  // 对象保存按钮
  handleSave = () => {
    // id:简档id, permission: 权限字符串,
    const payload = { id: this.props.profileData.id, permission: JSON.stringify(this.props.permissonStr), version: this.props.profileData.version };
    this.props.dispatch({ type: 'roleProfile/add', payload });
  }

  /** ******************************字段权限******************************************************/
  // 打开
  showModal = (e) => {
    this.props.dispatch({ type: 'roleProfile/field', payload: { id: this.props.profileData.id, objectId: e.id, type: 'profile', viewType: this.props.viewType } });
    this.setState({ visible: true, newKey: Math.random() });
  }
  // 关闭
  handleCancel = () => {
    this.setState({ visible: false, newKey: Math.random(), viewType: this.props.viewType });
  };
  // 字段保存按钮
  handleOk = () => {
    // 简档已经存在权限
    const permissonStr = this.props.permissonStr;
    // 简档页面选择对象权限集合
    const permissonSelect = this.props.permissonSelect;
    // 简档页面选择字段权限集合
    // const fields = this.props.fields;
    for (let j = 0; j < permissonSelect.length; j++) {
      const sel = permissonSelect[j];
      let selFlag = true;
      for (let i = 0; i < permissonStr.length; i++) {
        const obj = permissonStr[i];
        // 相同对象的场合，获得原有字段和页面选择字段
        if (obj.obj_id === sel.obj_id) {
          selFlag = false;
          const objField = toArray(obj.obj_field); // 原有字段集合
          const selField = toArray(sel.obj_field); // 页面选择字段集合
          for (let n = 0; n < selField.length; n += 1) {
            const sfield = selField[n];
            let sfieldFlag = true;
            for (let m = 0; m < objField.length; m += 1) {
              const ofield = objField[m];
              // 如果页面的选择的字段已经存在，做更新操作
              if (ofield.field_name === sfield.field_name) {
                sfieldFlag = false;
                ofield.field_value = sfield.field_value;
                objField[m] = ofield;
              }
            }
            // 如果页面选择的字段不存在，做追加操作
            if (sfieldFlag) {
              objField.push(sfield);
            }
          }
          // obj.obj_field = JSON.stringify(objField);
          obj.obj_field = objField;
        }
        permissonStr[i] = obj;
      }
      // 如果页面选择的字段对象不存在，做追加操作
      if (selFlag) {
        permissonStr.push(sel);
      }
    }
    console.log(permissonStr);
    this.setState({ visible: false });
    // id:简档id, permission: 权限字符串,
    const payload = { id: this.props.profileData.id, permission: JSON.stringify(permissonStr), version: this.props.profileData.version };
    this.props.dispatch({ type: 'roleProfile/add', payload });
  }


  handleSelect = (record, e) => {
    const fields = this.props.fields;
    const permissonSelect = this.props.permissonSelect;
    const field = { field_name: record.api_name, field_value: Math.pow(2, e.target.value) };
    fields.push(field);
    const obj = { obj_id: record.object_describe_id, obj_name: '', obj_value: 0, obj_field: JSON.stringify(fields) };
    permissonSelect.push(obj);
    this.props.dispatch({ type: 'roleProfile/fieldFlesh', payload: { fields, permissonSelect } });
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
      render: (text, record) => {
        return (
          <div>
            <RadioGroup
              onChange={this.handleSelect.bind(null, record)}
              defaultValue={fieldValue(this.props.permissonSelect, record)}
            >
              <Radio value={1}>禁止访问</Radio>
              <Radio value={2}>只读访问</Radio>
              <Radio value={3}>完全控制</Radio>
            </RadioGroup>
          </div>
        );
      },
    }];

    const role_table = { margin: '10px 10px' };
    const role_tbs = { width: '40%' };
    const pop_div = { width: '600px', margin: '20px' };

    const list = this.props.objectList;
    const roleChildren = list.map((obj) => {
      return (<TreeNode title={obj.display_name} key={obj.id}>
        <TreeNode title="新增" key={`${obj.id}-1-${obj.api_name}`} />
        <TreeNode title="编辑" key={`${obj.id}-2-${obj.api_name}`} />
        <TreeNode title="查看" key={`${obj.id}-3-${obj.api_name}`} />
        <TreeNode title="删除" key={`${obj.id}-4-${obj.api_name}`} />
        <TreeNode title="列表" key={`${obj.id}-5-${obj.api_name}`} />
        <TreeNode title="导入" key={`${obj.id}-6-${obj.api_name}`} />
        <TreeNode title="导出" key={`${obj.id}-7-${obj.api_name}`} />
      </TreeNode>
      );
    });

    return (
      <Tabs style={role_tbs}>
        <TabPane tab="功能权限" key="1">
          <Tree
            checkable
            onSelect={this.onSelect}
            onCheck={this.onCheck}
            selectedKeys={this.props.nodes}
            checkedKeys={this.props.nodes}
          >
            {roleChildren}
          </Tree>
          <Button onClick={this.handleSave} disabled={this.props.viewType}>保存</Button>
        </TabPane>
        <TabPane tab="字段使用" key="2">
          <h3>标准业务对象</h3>
          <Table
            showHeader={false}
            pagination={false}
            columns={columns}
            style={role_table}
            dataSource={this.props.objectList}
          />

          <Modal
            width="660px" visible={this.state.visible} key={this.state.newKey}
            onCancel={this.handleCancel}
            footer={[
              <Button key="back" size="large" onClick={this.handleCancel}>返回</Button>,
              <Button key="submit" type="primary" size="large" onClick={this.handleOk} disabled={this.props.viewType}>
                 提交
                 </Button>,
            ]}
          >
            <div style={pop_div}>
              <Table
                pagination={false}
                rowKey={record => record.id}
                columns={popColumns}
                style={role_table}
                dataSource={this.props.objectFieldList}
                loading={this.props.loading}
                bordered
              />
            </div>
          </Modal>
        </TabPane>
      </Tabs>
    );
  }
}

export default RoleSimpleProfile;
