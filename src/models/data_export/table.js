import { message } from 'antd';
import _ from 'lodash';
import { redirectToList, saveData } from '../../utils/custom_util';
import * as baseModel from '../base';
import mixinModels from '../../libs/mixinModels';

const initialState = {

};

export default mixinModels(baseModel, {
    namespace: 'data_export_table',
    state: Object.assign({}, initialState),
    reducers: {

    },
    effects: {
        *fetchIfFirst() {
            
        }
    },
    subscriptions: {
        // 路由监听器
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/data_export/table') {
                    /**
                     * doNothing
                     */
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