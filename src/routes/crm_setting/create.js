/*
 * @Author: mll
 * @Date: 2018-09-05 17:30
 * @Last Modified by: mll
 * @Last Modified time: 2018-09-05 17:30
 * @Description:
 */
import React from 'react';
import { connect } from 'dva';
import CRMSettingForm from './form';

const TenentSettingCreate = ({ body, dispatch, location }) => {
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

export default connect((state) => {
  const { body } = state.crm_setting_create;
  return {
    body,
  };
})(TenentSettingCreate);
