import { message } from 'antd';
import _ from 'lodash';
import { redirectToList, saveData } from '../../utils/custom_util';
import * as baseModel from '../base';
import * as paginationModel from '../pagination';
import mixinModels from '../../libs/mixinModels';
import * as exportHistoryService from '../../services/exportHistory';
import { hashHistory } from 'dva/router';

/**
 * 初始state
 */
const initialState = {
    script: {
        api_name: null,
        name: null,
        remark: null,
        scripts: ``,
        label: ``,
        front_end_export: false,
        profile:[],// 简档
        set_params:[],// 参数设置
    },
    loading: false,
};

export default mixinModels(baseModel, paginationModel, {
    namespace: 'data_export_history_detail',
    state: Object.assign({}, initialState),
    reducers: {
        /**
         * 更新脚本对象
         */
        updateScript(state,{ payload }) {
            return {
                ...state,
                script: Object.assign({}, state.script, payload)
            }
        }
    },
    effects: {
        *fetch({ payload }, { call, put, select }){
          const { id } = payload;
          const response = yield call(exportHistoryService.fetchById, id);
          if(response) {
            const code = _.get(response, 'data.data.head.code');
            if(code === 200) {
              const result = _.get(response, 'data.data.body');
              yield put({
                type: 'updateScript',
                payload: result,
              })
            }
          }
        },
    },
    subscriptions: {
        // 路由监听器
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/data_export/export_history_detail') {
                    dispatch({
                      type: 'fetch',
                      payload: {
                        id: query.id,
                      }
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