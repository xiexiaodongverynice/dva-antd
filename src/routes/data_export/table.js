import React from 'react';
import { Table, Tabs } from 'antd';
import { connect } from 'dva';

const DataExportTablePage = ({
    dispatch,
}) => {
    return (
        <div>
            
        </div>
    );
};

function mapStateToProps(state) {
    const { body, resultCount, pageNo, pageSize } = state.data_export_table;
    return {
      body,
    };
  }


export default connect(mapStateToProps)(DataExportTablePage);
