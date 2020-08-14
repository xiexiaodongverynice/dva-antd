import { message } from 'antd';
import _ from 'lodash';
import { redirectToList, saveData } from '../../utils/custom_util';
import * as baseModel from '../base';
import mixinModels from '../../libs/mixinModels';

function* fetchData(active, { put }) {
    switch(active) {
        case "1":
            yield put({
                type: 'data_export_history/fetchIfFirst',
            })
            break;
        case "2": 
            yield put({
                type: 'data_export_table/fetchIfFirst',
            });
            break;
        default:
            break;
    }
};

const initialState = {

    active: "1",

};

export default mixinModels(baseModel, {
    namespace: 'data_export',
    state: Object.assign({}, initialState),
    reducers: {

    },
    effects: {
        *fetchData({ payload }, saga) {
            const { select } = saga;
            const { active } = yield select(state => state.data_export);
            yield fetchData(active, saga);
        }
    },
    subscriptions: {
        // 路由监听器
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/data_export') {
                    dispatch({
                        type: 'fetchData',
                    });
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