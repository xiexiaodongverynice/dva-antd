import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router';
import cx from 'classnames';
import styles from './Menu.less';

const SubMenu = Menu.SubMenu;
const mainMenu = ({ location, collapsed }) => {
  const str = {};
  str.pathname = location.pathname;
  const arr = str.pathname.split('/');
  return (
    <Menu theme="dark" mode={collapsed ? 'vertical' : 'inline'} selectedKeys={[`/${arr[1]}`]}>
      <Menu.Item key="/home">
        <Link to={'/home'}>
          <Icon type="home" />
          <span className={collapsed ? styles.nav_text : ''}>首页</span>
        </Link>
      </Menu.Item>
      <SubMenu
        title={
          <span>
            <Icon type="appstore-o" />
            <span className={collapsed ? styles.nav_text : ''}> 基础信息</span>
          </span>
        }
      >
        <Menu.Item key="/user">
          <Link to={'/user'}>
            <Icon type="team" />
            <span>用户管理</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/profile">
          <Link to={'/profile'}>
            <Icon type="folder" />
            <span>简档管理</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/role">
          <Link to={'/role'}>
            <Icon type="user-add" />
            <span>角色管理</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/group">
          <Link to={'/group'}>
            <Icon type="hdd" />
            <span>权限组管理</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/duties">
          <Link to={'/duties'}>
            <Icon type="user" />
            <span>职务管理</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/department">
          <Link to={'/department'}>
            <Icon type="exception" />
            <span>部门管理</span>
          </Link>
        </Menu.Item>
        {/**
           <Menu.Item key="/architecture">
            <Link to={'/architecture'}>
              <Icon type="api" />
              <span >架构管理</span>
            </Link>
          </Menu.Item>
           */}
        <Menu.Item key="/newarchitecture">
          <Link to={'/newarchitecture'}>
            <Icon type="api" />
            <span>业务数据</span>
          </Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu
        title={
          <span>
            <Icon type="appstore" />
            <span className={collapsed ? styles.nav_text : ''}>业务对象管理</span>
          </span>
        }
      >
        <Menu.Item key="/customObjects">
          <Link to={'/customObjects'}>
            <Icon type="solution" />
            <span>对象与字段</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/layouts">
          <Link to={'/layouts/list'}>
            <Icon type="layout" />
            <span>布局</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/layout_assign">
          <Link to={'/layout_assign/list'}>
            <Icon type="exception" />
            <span>布局分配</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/kpi_def">
          <Link to={'/kpi_def/list'}>
            <Icon type="layout" />
            <span>KPI定义</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/tabs">
          <Link to={'/tabs'}>
            <Icon type="menu-fold" />
            <span>导航菜单</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/trigger">
          <Link to={'/trigger'}>
            <Icon type="step-forward" />
            <span>触发器</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/action_script">
          <Link to={'/action_script'}>
            <Icon type="code" />
            <span>Action脚本</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/schedule">
          <Link to={'/schedule'}>
            <Icon type="schedule" />
            <span>定时任务</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/sequence">
          <Link to={'/sequence'}>
            <Icon type="barcode" />
            <span>序列</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/translation">
          <Link to={'/translation'}>
            <Icon type="edit" />
            <span>翻译控制台</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/metadata_sync_index">
          <Link to={'/metadata_sync/index'}>
            <Icon type="sync" />
            <span>元数据同步</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/approval_flow">
          <Link to={'/approval_flow/index'}>
            <Icon type="share-alt" />
            <span>审批流</span>
          </Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu
        title={
          <span>
            <Icon type="database" />
            <span className={collapsed ? styles.nav_text : ''}>工作流程管理</span>
          </span>
        }
      >
        <Menu.Item key="/flow_management">
          <Link to={'/flow_management/index'}>
            <Icon type="share-alt" />
            <span>流程管理</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/model_management">
          <Link to={'/model_management/index'}>
            <Icon type="share-alt" />
            <span>模型管理</span>
          </Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu
        title={
          <span>
            <Icon type="database" />
            <span className={collapsed ? styles.nav_text : ''}>数据管理</span>
          </span>
        }
      >
        <Menu.Item key="/data_export">
          <Link to={'/data_export'}>
            <i className={cx('iconfont icon-data-export', styles.icon)} />
            <span>数据导出</span>
          </Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu
        title={
          <span>
            <Icon type="setting" />
            <span className={collapsed ? styles.nav_text : ''}>CRM 配置</span>
          </span>
        }
      >
        <Menu.Item key="/crm_alert">
          <Link to={'/crm_alert'}>
            <Icon type="notification" />
            <span>通知设置</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/crm_calendar">
          <Link to={'/crm_calendar'}>
            <Icon type="calendar" />
            <span>日历设置</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/languageSetting">
          <Link to={'/languageSetting'}>
            <Icon type="edit" />
            <span>默认语言设置</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/logoSetting">
          <Link to={'/logoSetting'}>
            <Icon type="picture" />
            <span>LOGO设置</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/crm_setting/index">
          <Link to={'/crm_setting/index'}>
            <Icon type="picture" />
            <span>全部设置</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/security_check/index">
          <Link to={'/security_check/index'}>
            <Icon type="key" />
            <span>安全策略设置</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/authentication_method/index">
          <Link to={'/authentication_method/index'}>
            <Icon type="notification" />
            <span>认证方式</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/sso/index">
          <Link to={'/sso/index'}>
            <Icon type="sync" />
            <span>单点登录</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/sso/oauth">
          <Link to={'/sso/oauth'}>
            <Icon type="sync" />
            <span>oauth管理配置</span>
          </Link>
        </Menu.Item>
      </SubMenu>
    </Menu>
  );
};

export default mainMenu;
