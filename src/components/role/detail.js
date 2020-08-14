import React from 'react';
import { routerRedux } from 'dva/router';
import { Button, Row, Col, Popconfirm } from 'antd';
import styles from './detail.less';


class roleDetail extends React.Component {

  delPage = (id) => {
    this.props.dispatch({ type: 'roles/delRole', payload: { id } });
  }

  edit = (role = {}) => {
    const { id, name: parentName } = role;
    this.props.dispatch(routerRedux.push({
      pathname: '/role/edit',
      query: {
        id,
      },
      state: {
        parentName,
      },
    }));
  }
  goBack = () => {
    window.history.back();
  }

  abc = () => {
    const e = this.props.role.job;
    if (e == 2) {
      return ('本岗');
    }
    if (e == 4) {
      return ('本岗及本岗下属');
    }
    if (e == 6) {
      return ('全部');
    }
  }

  render() {
    const { role } = this.props;

    return (

      <div className={styles.mybox}>
        <h1>角色：{role.name}</h1>
        <span>要将其他用户分配给此角色：</span><br />
        <span>
          下面是分配为此角色的用户列表。单击"编辑"按钮以修改角色名。单击"为用户分配角色"将现有用户分配为该角色。单击"新建用户"为此角色创建用户。
        </span>

        <hr />
        <div className={styles.myButton}>
          <Button type="primary" onClick={this.edit.bind(null, role)}>编辑</Button>
          <Popconfirm title="确认要删除角色?" onConfirm={this.delPage.bind(null, role.id)}>
            <Button type="primary">删除</Button>
          </Popconfirm>

          <Button type="primary" onClick={this.goBack}>取消</Button>
        </div>
        <Row gutter={16} type="flex" justify="center">
          <Col span={4}><span style={{ float: 'right' }}>标签：</span></Col>
          <Col span={4}>{role.name}</Col>
          <Col span={4}><span style={{ float: 'right' }}>API名称：</span></Col>
          <Col span={4}>{role.api_name}</Col>
        </Row>
        <Row gutter={16} type="flex" justify="center">
          <Col span={4}><span style={{ float: 'right' }}>数据权限：</span></Col>
          <Col span={4}>

            {
              this.abc()
            }
          </Col>
          <Col span={4}><span style={{ float: 'right' }}>修改人：</span></Col>
          <Col span={4}>{role.update_by}</Col>
        </Row>
      </div>
    );
  }
}


export default roleDetail;
