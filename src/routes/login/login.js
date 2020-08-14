import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import Login from '../../components/login/login';

import styles from './login.less';

function mainLogin({ dispatch, loading }) {
  function createHandler(values) {
    dispatch({
      type: 'login/login',
      payload: values,
    });
  }

  return (
    <div className={styles.form}>
      <div className={styles.leftBox}>
        <div className={styles.textBox}>
          <h2>「有效驱动您的销售团队」</h2>
          云势软件（FORCECLOUDS.COM）是中国生命科学行业销售自动化云解决方案领导者，专注于销售自动化管理领域的中国领先的SaaS服务商，为客户提供简单、安全、高效、合规的云端销售自动化创新解决方案，包括客户关系管理，销售区域管理，销售指标分配，销售佣金管理以及销售绩效管理等。
        </div>
      </div>
      <div className={styles.rightBox}>
        <Spin spinning={loading} size="large">
          <Login onOk={createHandler} />
        </Spin>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    loading: state.loading.global,
  };
}

export default connect(mapStateToProps)(mainLogin);
