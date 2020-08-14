/**
 * Created by Administrator on 2017/5/16 0016.
 */
import React from 'react';
import { connect } from 'dva';
import styles from './customObjects.css';
import CustomFieldList from './../../components/objects/customFieldList';
// import MainLayout from '../components/MainLayout/MainLayout';

function CustomFields() {
  return (
    <div className={styles.normal}>
      <CustomFieldList />
    </div>
  );
}
export default connect()(CustomFields);
