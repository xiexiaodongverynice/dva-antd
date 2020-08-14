import React, { Component } from 'react';
import { Icon, Popconfirm, message } from 'antd';
import { hashHistory } from 'dva/router';
import styles from './Header.less';
import * as logoutService from '../../services/logout';
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  toggle = () => {
    const { onOk } = this.props;
    onOk(!this.state.visible);
    this.setState({
      visible: !this.state.visible,
    });
  };
  logout = () => {
    logoutService.gologout(localStorage.getItem('token'));
    hashHistory.push('/login');
    localStorage.removeItem('token');
    localStorage.removeItem('adminUserInfo');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userPermission');
    message.success('登出成功');
  };

  render() {
    return (
      <div style={{ background: '#fff', padding: 0, height: 60 }}>
        <div className={styles.triggerL}>
          <Icon
            className={styles.trigger}
            type={this.state.visible ? 'menu-unfold' : 'menu-fold'}
            onClick={this.toggle}
          />
        </div>
        <div className={styles.triggerC}>
          <h1>CRM POWER 后台管理系统</h1>
        </div>
        <div className={styles.triggerR}>
          <Icon className={styles.trigger} type="question-circle-o" />
          <Popconfirm title="确认要退出系统?" onConfirm={this.logout}>
            <Icon className={styles.trigger} type="logout" />
          </Popconfirm>
        </div>
      </div>
    );
  }
}

export default Header;
