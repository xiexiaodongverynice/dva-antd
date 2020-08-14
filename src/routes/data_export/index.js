import React from 'react';
import { Table, Tabs } from 'antd';
import { connect } from 'dva';
import DataExportHistoryPage from './export_history';
import DataExportScriptPage from './export_script'

const TabPane = Tabs.TabPane;

const DataExportPage = ({
    dispatch,
    active,
}) => {

    const tabChange = (active) => {
        dispatch({
            type: 'data_export/assignState',
            payload: {
                active
            }
        });

        dispatch({
            type: 'data_export/fetchData',
        })
    };

    return (
        <div className="card-container">
            <Tabs onChange={tabChange} type="card">
            <TabPane tab="脚本导出任务" key="1">
                <DataExportHistoryPage/>
            </TabPane>
            <TabPane tab="脚本管理" key="2">
                <DataExportScriptPage/>
            </TabPane>
            </Tabs>
        </div>
    );
};

function mapStateToProps(state) {
    const { active } = state.data_export;
    return {
      active,
    };
  }


export default connect(mapStateToProps)(DataExportPage);
