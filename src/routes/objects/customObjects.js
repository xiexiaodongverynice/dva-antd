/**
 * Created by Administrator on 2017/5/16 0016.
 */
import React from 'react';
import { connect } from 'dva';
import styles from './customObjects.css';
import CustomObjectList from './../../components/objects/customObjectList';

function CustomObjects() {
  return (
    <div className={styles.normal}>
      <CustomObjectList />
    </div>
  );
}
export default connect()(CustomObjects);
