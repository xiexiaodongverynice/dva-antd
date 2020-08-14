import React from 'react';
// import { connect } from 'dva';
import ExternalPageIndex from '../../components/external_page/external_page';
import { workFlowURL } from '../../utils/config';

const FlowManagement = () => {
  const token = localStorage.getItem('token');
  return (
    <div style={{ paddingTop: '24px', background: '#fff', minHeight: 525 }}>
      <ExternalPageIndex
        external_page_src={`${workFlowURL}/#/iframe/approval_process_manage`}
        external_page_param={{ token }}
      />
    </div>
  );
};

export default FlowManagement;
