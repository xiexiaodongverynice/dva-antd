import { routerRedux } from 'dva/router';
import * as layoutService from '../../services/layout';
import * as objectService from '../../services/customObjects';

export default {
  effects: {
    *create({ payload }, { call, put }) {
      const { layout_type, object_describe_api_name } = payload;

      if (layout_type === 'detail_page') {
        // 校验是否所有的必填字段都在其中了
        const resp = yield call(objectService.fetchByApiName, { object_api_name: object_describe_api_name });
        console.log(resp);
      }

      yield call(layoutService.create, payload);
      yield put(routerRedux.push('/layouts/list'));
      yield put({
        type: 'assignState',
        payload: {
          layout: payload,
        },
      });
    },
  }
};
