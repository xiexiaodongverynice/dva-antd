import React from 'react';
import { connect } from 'dva';
import { Layout, Spin } from 'antd';
import { hashHistory } from 'react-router';
import MainHeader from './Header';
import MainMenu from './Menu';
import Breadcrumb from './Breadcrumb';
import styles from './Layout.less';

const { Sider, Content } = Layout;
const mainLayout = ({
                      routes,
                      children,
                      location,
                      dispatch,
                      collapsed,
                      loading,
                    }) => {
  if (location.pathname === '/' || !localStorage.getItem('token')) {
    hashHistory.push('/login');
  }

  function createHandler(collapseds) {
    dispatch({
      type: 'App/isswitch',
      payload: collapseds,
    });
  }
  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, zIndex: 100 }}
      >
        <div className={styles.logo} />
        <MainMenu location={location} collapsed={collapsed} />
      </Sider>
      <Layout
        className={styles.margin}
        style={collapsed === false ? { background: '#fff',
          height: '100%',
          marginLeft: 200,
        } : { background: '#fff',
          height: '100%',
          marginLeft: 64,
          zIndex: 0,
        }}
      >
        <MainHeader collapsed={collapsed} onOk={createHandler} />
        <Breadcrumb {...{ routes, dispatch, location }} />
        <Spin spinning={loading} size="large">
          <Content style={{ margin: '0px 16px', padding: 24, background: '#fff' }}>
            {children}
          </Content>
        </Spin>
      </Layout>
    </Layout>
  );
};

function mapStateToProps(state) {
  const { collapsed } = (state.App);
  return {
    loading: state.loading.global,
    collapsed,
  };
}

export default connect(mapStateToProps)(mainLayout);
