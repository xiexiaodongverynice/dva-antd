/**
 * Created by xinli on 06/06/2017.
 */
import React from 'react';
import { connect } from 'dva';
import TabList from '../../components/tab/list';

const Tabs = () => {
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 525 }}>
      <TabList />
    </div>
  );
};

export default connect()(Tabs);
