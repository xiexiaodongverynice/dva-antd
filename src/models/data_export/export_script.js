import { message } from 'antd';
import _ from 'lodash';
import { redirectToList, saveData } from '../../utils/custom_util';
import * as baseModel from '../base';
import * as paginationModel from '../pagination';
import mixinModels from '../../libs/mixinModels';
import * as exportScriptService from '../../services/exportScript';
import { hashHistory } from 'dva/router';

function* fetchList({ payload = {} }, { call, put, select }) {
    const state = yield select(state => state.data_export_script);
    const { data } = yield call(exportScriptService.fetch, Object.assign({}, _.pick(state, ['pageNo', 'pageSize', 'order', 'orderBy']), payload));
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
    const response = yield call(exportScriptService.del, {
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

function* run({ payload }, {call, put}){
    const { id } = payload;
    const response = yield call(exportScriptService.run, {
        id
    });
    if(response) {
        const code = _.get(response, 'data.data.head.code');
        if(code === 200) {
            message.success('操作成功!');
            hashHistory.push({
                pathname: '/data_export'
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
};

export default mixinModels(baseModel, paginationModel, {
    namespace: 'data_export_script',
    state: Object.assign({}, initialState),
    reducers: {

    },
    effects: {
        *fetch({ payload }, saga) {
            yield fetchList({ payload }, saga);
        },
        
        *fetchIfFirst({ payload }, saga) {
            const { select } = saga;
            const { fetched } = yield select(state => state.data_export_script);
            if(!fetched) {
                yield fetchList({ payload }, saga);
            }
        },

        *delete({ payload }, saga) {
            yield __delete({ payload }, saga);
        },

        *run({ payload }, saga) {
            yield run({payload}, saga);
        }
    },
    subscriptions: {
        // 路由监听器
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/data_export') {
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