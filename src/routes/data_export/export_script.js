import React from 'react';
import { Table, Pagination, Row, Button, Popconfirm, message } from 'antd';
import { connect } from 'dva';
import styles from '../../styles/list.less';
import { formatTimeFull } from '../../utils/date';
import { hashHistory } from 'dva/router';

const DataExportScriptPage = ({
    dispatch,
    body,
    pageNo,
    pageSize,
    resultCount,
}) => {
    function detailPage(record) {
        const { id } = record;
        hashHistory.push({
            pathname: '/data_export/export_script_detail',
            query: { id },
        });
    }
    function delPage(id) {
        dispatch({ type: 'data_export_script/delete', payload: { id } });
    }

    function runTask(record) {
        if(!_.isEmpty(_.get(record,'set_params'))) {
          message.error('缺少参数值，请在业务端进行！');
          return
        }
        dispatch({
            type: 'data_export_script/run',
            payload: {
              id:record.id,
            }
        })
    }

    function editPage(record) {
        hashHistory.push({
            pathname: '/data_export/export_script_edit',
            query: {
                id: record.id,
            },
            state: {
                parentName: record.name,
            }
        });
    }

    const indexPage = (pageNo, pageSize) => {
        dispatch({
            type: 'data_export_script/assignState',
            payload: {
                pageNo,
                pageSize,
            },
        });
        dispatch({
            type: 'data_export_script/fetch',
        });
    }

    const onChange = (pagination, filter, sorter) => {
        const { order, field } = sorter;
        dispatch({
            type: 'data_export_script/assignState',
            payload: {
                order,
                orderBy: field,
            },
        });
        dispatch({
            type: 'data_export_script/fetch',
        });
    }

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
        sorter: true,
    }, {
        title: '描述',
        dataIndex: 'remark',
        key: 'remark',
    }, {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        width: 150,
        render: formatTimeFull,
    }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
            <span>
                <a onClick={editPage.bind(null, record)}>编辑</a>
                <span className="ant-divider" />
                <a onClick={detailPage.bind(null, record)}>查看</a>
                <span className="ant-divider" />
                <Popconfirm title="确认要运行任务吗?" onConfirm={runTask.bind(null, record)}>
                    <a>运行</a>
                </Popconfirm>
                <span className="ant-divider" />
                <Popconfirm title="确认要删除菜单?" onConfirm={delPage.bind(null, record.id)}>
                    <a>删除</a>
                </Popconfirm>
            </span>
        ),
    }];
    return (
        <div>

            <Row style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                height: 40
            }}>
                <Button type="primary" onClick={() => {
                    hashHistory.push({
                        pathname: 'data_export/export_script_new'
                    });
                }}>
                    新建脚本
                </Button>
            </Row>

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
        </div>
    );
};

function mapStateToProps(state) {
    const { body, resultCount, pageNo, pageSize } = state.data_export_script;
    return {
        body,
        resultCount,
        pageNo,
        pageSize,
    };
}


export default connect(mapStateToProps)(DataExportScriptPage);
