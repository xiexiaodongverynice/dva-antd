import React from 'react';
import { Table, Pagination, Row, Button, Popconfirm, Modal } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import AceEditor from 'react-ace';
import 'brace/mode/text';
import 'brace/theme/github';
import 'brace/ext/searchbox';
import styles from '../../styles/list.less';
import { formatTimeFull } from '../../utils/date';
import { hashHistory } from 'dva/router';
import { red500, green500, blue500 } from '../../stylers/colors';
import Style from '../../components/layout/layoutEditor.less';

const DataExportHistoryPage = ({
    dispatch,
    body,
    pageNo,
    pageSize,
    resultCount,
    visible,
    export_history_log,
}) => {
    function detailPage(record) {
        const { id } = record;
        hashHistory.push({
            pathname: '/data_export/export_history_detail',
            query: { id },
        });
    }
    function delPage(id) {
        dispatch({ type: 'data_export_history/delete', payload: { id } });
    }

    const indexPage = (pageNo, pageSize) => {
        dispatch({
            type: 'data_export_history/assignState',
            payload: {
                pageNo,
                pageSize,
            },
        });
        dispatch({
            type: 'data_export_history/fetch',
        });
    }

    const onChange = (pagination, filter, sorter) => {
        const { order, field } = sorter;
        dispatch({
            type: 'data_export_history/assignState',
            payload: {
                order,
                orderBy: field,
            },
        });
        dispatch({
            type: 'data_export_history/fetch',
        });
    }

    const download = (record) => {
        const { file_key } = record;
        dispatch({
            type: 'data_export_history/download',
            payload: {
                file_key,
            }
        })
    }

    const handleOk = () => {
        dispatch({
            type: 'data_export_history/assignState',
            payload: {
                visible: false,
                export_history_log: null,
            }
        })
    }

    const handleCancel = () => {
        dispatch({
            type: 'data_export_history/assignState',
            payload: {
                visible: false,
                export_history_log: null,
            }
        })
    }

    const viewLog = (record) => {
        const { id } = record;
        dispatch({
            type: 'data_export_history/fetchLogByExportHistoryId',
            payload: {
                id,
            }
        })
    };

    const columns = [{
        title: '脚本名称',
        key: 'name',
        dataIndex: 'name',
    }, {
        title: 'API_NAME',
        dataIndex: 'api_name',
        key: 'api_name',
    }, {
        title: '创建人',
        dataIndex: 'create_by__r.name',
        key: 'create_by__r.name',
        width: 150,
    }, {
        title: '开始时间',
        dataIndex: 'run_time',
        key: 'run_time',
        width: 150,
        render: (val) => {
            if(val) {
                return formatTimeFull(val)
            }else {
                return null;
            }
        },
    }, {
        title: '完成时间',
        dataIndex: 'done_time',
        key: 'done_time',
        width: 150,
        render: (val) => {
            if(val) {
                return formatTimeFull(val)
            }else {
                return null;
            }
        },
    }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (val) => {
            switch(val) {
                case "0":
                    return '已经初始化';
                case "1":
                    return '等待执行';
                case "2":
                    return <span style={{
                        color: blue500
                    }}>运行中</span>;;
                case "3":
                    return '已取消';
                case "4":
                    return <span style={{
                        color: green500
                    }}>已完成</span>;
                case "5":
                    return <span style={{
                        color: red500
                    }}>失败</span>;
                default:
                    return '状态未知';
            }
        }
    }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
            <span>
                <a onClick={detailPage.bind(null, record)}>查看</a>
                {
                    record.status === '4' && record.file_key? [
                        <span className="ant-divider" />,
                        <a onClick={download.bind(null, record)}>下载</a>
                    ]: null
                }
                {
                    record.status === '3' || record.status === '5'? [
                        <span className="ant-divider" />,
                        <Popconfirm title="确认要删除菜单?" onConfirm={delPage.bind(null, record.id)}>
                            <a>删除</a>
                        </Popconfirm>
                    ]: null
                }
                {
                    record.status !== '0'? [
                        <span className="ant-divider" />,
                        <a onClick={viewLog.bind(null, record)}>任务日志</a>
                    ]: null
                }
            </span>
        ),
    }];
    return (
        <div>

            {/* <Row style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                height: 40
            }}>
                <Button type="primary" onClick={() => {
                    hashHistory.push({
                        pathname: 'data_export/export_script'
                    });
                }}>
                    脚本管理
                </Button>
            </Row> */}

            <Table
                pagination={false}
                rowKey={record => record.id}
                dataSource={body.result}
                columns={columns}
                onChange={onChange}
            />

            <div className={styles.PaginationBox}>
                <Pagination
                    showSizeChanger
                    total={resultCount}
                    showTotal={total => `共 ${resultCount} 条`}
                    pageSize={pageSize}
                    current={pageNo}
                    onChange={indexPage}
                    onShowSizeChange={indexPage}
                    className={styles.myPagination}
                />
            </div>

            <Modal
                title="任务日志"
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                >
                 <AceEditor
                    mode="text"
                    theme="github"
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{ $blockScrolling: true }}
                    value={_.get(export_history_log, 'log')}
                    width="100%"
                    className={Style.AceEitor}
                    readOnly={true}
                />
            </Modal>
        </div>
    );
};

function mapStateToProps(state) {
    const { body, resultCount, pageNo, pageSize, visible, export_history_log } = state.data_export_history;
    return {
        body,
        resultCount,
        pageNo,
        pageSize,
        visible,
        export_history_log,
    };
}


export default connect(mapStateToProps)(DataExportHistoryPage);
