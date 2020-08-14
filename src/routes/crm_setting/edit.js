import React from 'react';
import { connect } from 'dva';
import { Row, Col, Button, message } from 'antd';
import Style from './alertSetting.less';
import CRMSettingForm from './form';

const TenentSettingEdit = ({ body, dispatch, location }) => {
  return (
    <div>
      <CRMSettingForm
        body={body}
        dispatch={dispatch}
        location={location}
      />
    </div>
  );
};

function mapStateToProps(state) {
  const { body } = state.crm_setting_edit;
  return {
    body,
  };
}

export default connect(mapStateToProps)(TenentSettingEdit);
