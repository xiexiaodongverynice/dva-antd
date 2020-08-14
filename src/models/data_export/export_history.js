import { message } from 'antd';
import _ from 'lodash';
import { redirectToList, saveData } from '../../utils/custom_util';
import * as baseModel from '../base';
import * as paginationModel from '../pagination';
import mixinModels from '../../libs/mixinModels';
import * as exportHistoryService from '../../services/exportHistory';

function* fetchList({ payload = {} }, { call, put, select }) {
    const state = yield select(state => state.data_export_history);
    const { data } = yield call(exportHistoryService.fetch, Object.assign({}, _.pick(state, ['pageNo', 'pageSize', 'order', 'orderBy']), payload));
    yield saveData(data, { put });
    yield put({
        type: 'assignState',
        payload: {
            fetched: true,
        }
    });
}

function* __delete({ payload }, { call, put }) {
    const { id } = payload;
    const response = yield call(exportHistoryService.del, {
        id
    });
    if(response) {
        const code = _.get(response, 'data.data.head.code');
        if(code === 200) {
            message.success('删除成功!');
            yield put({
                type: 'fetch',
            })
        }
    }
}

function* __fetchLogByExportHistoryId({ payload }, { call, put }) {
    const { id } = payload;
    const response = yield call(exportHistoryService.fetchLogByExportHistoryId, id);
    if(response) {
        const code = _.get(response, 'data.data.head.code');
        if(code === 200) {
            const result = _.get(response, 'data.data.body');
            yield put({
                type: 'assignState',
                payload: {
                    export_history_log: result,
                    visible: true,
                },
            })
        }
    }
}

const initialState = {
    body: [],

    pageNo: 1,
    pageSize: 10,
    resultCount: 0,

    order: 'desc',
    orderBy: 'create_time',


    fetched: false,

    export_history_log: null,

    visible: false,
};

export default mixinModels(baseModel, paginationModel, {
    namespace: 'data_export_history',
    state: Object.assign({}, initialState),
    reducers: {

    },
    effects: {
        *fetch({ payload }, saga) {
            yield fetchList({ payload }, saga);
        },
        
        *fetchIfFirst({ payload }, saga) {
            const { select } = saga;
            const { fetched } = yield select(state => state.data_export_history);
            if(!fetched) {
                yield fetchList({ payload }, saga);
            }
        },

        *download({ payload }) {
            const { file_key } = payload;
            exportHistoryService.download(file_key);
        },

        *delete({ payload }, saga) {
            yield __delete({ payload }, saga);
        },

        *fetchLogByExportHistoryId({ payload }, saga) {
            yield __fetchLogByExportHistoryId({payload}, saga);
        }
    },
    subscriptions: {
        // 路由监听器
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/data_export/export_history') {
                    dispatch({ type: 'fetch', payload: query });
                } else {
                    dispatch({
                        type: 'assignState',
                        payload: Object.assign({}, initialState)
                    })
                }
            });
        },
    },

});