import { message } from 'antd';
import { fetchCustomObjects,
         fetchCustomObjectDetailLayouts,
         createCustomObjectDetailLayout,
         editCustomObjectDetailLayout,
         fetchCustomObjectDetailLayot,
         fetchCustomObjectDescribe,
         fetchCustomObjectDescribeRelatedList } from '../services/customDetails';

export default {
  namespace: 'customDetails',
  state: {
    customObjects: [],
    selectedObject: null,
    customObjectDetailLayouts: [],
    customObjectDetailLayout: {
      object: {},
      raw: '',
    },
    objectsDescribe: {},
    selectedLayoutType: 'index_page',
  },

  reducers: {
    fetchCustomObjectsSuccess(state, action) {
      return {
        ...state,
        customObjects: action.payload.body,
      };
    },

    fetchCustomObjectDescribeSuccess(state, action) {
      return {
        ...state,
        objectsDescribe: {
          ...state.objectsDescribe,
          [action.payload.body.api_name]: action.payload.body,
        },
      };
    },

    fetchCustomObjectDetailLayoutsSuccess(state, action) {
      return {
        ...state,
        customObjectDetailLayouts: action.payload.body,
        selectedObject: action.meta,
      };
    },

    fetchCustomObjectDetailLayoutSuccess(state, action) {
      let customObjectDetailLayout = null;
      if (action.meta === 'raw') {
        customObjectDetailLayout = {
          ...state.customObjectDetailLayout,
          raw: action.payload.body,
        };
      } else {
        const object = action.payload.body;
        customObjectDetailLayout = {
          object,
          raw: object && Object.keys(object).length !== 0 ? JSON.stringify(action.payload.body, null, '\t') : '',
        };
      }
      return {
        ...state,
        customObjectDetailLayout,
      };
    },

    changeSelectedLayoutType(state, action) {
      const { selectedLayoutType } = action.payload;
      return {
        ...state,
        selectedLayoutType,
      };
    },
  },

  effects: {
    *fetchCustomObjects({ payload }, { call, put }) {
      const { data } = yield call(fetchCustomObjects);
      if (data) {
        if (!data.data.body.items) {
          data.data.body.items = [];
        }
        const { items, pageNo, resultCount, pageSize } = data.data.body;
        yield put({
          type: 'fetchCustomObjectsSuccess',
          payload: {
            body: items,
            pageNo,
            resultCount,
            pageSize,
          },
        });
      }
    },

    *fetchCustomObjectDetails({ payload }, { call, put }) {
      const { data } = yield call(fetchCustomObjectDetailLayouts, payload);
      if (data) {
        if (!data.data.body.items) {
          data.data.body.items = [];
        }
        const { items, pageNo, resultCount, pageSize } = data.data.body;
        yield put({
          type: 'fetchCustomObjectDetailLayoutsSuccess',
          meta: payload,
          payload: {
            body: items,
            pageNo,
            resultCount,
            pageSize,
          },
        });
      }
    },

    *fetchCustomObjectDetailLayout({ payload }, { call, put }) {
      const { data } = yield call(fetchCustomObjectDetailLayot, payload);
      if (data) {
        yield put({
          type: 'fetchCustomObjectDetailLayoutSuccess',
          meta: payload,
          payload: {
            body: data.data.body,
          },
        });
      }
    },

    *fetchCustomObjectDescribe({ payload }, { call, put }) {
      const { data: describeData } = yield call(fetchCustomObjectDescribe, payload);
      const { data: relatedListData } = yield call(fetchCustomObjectDescribeRelatedList, payload);
      if (describeData && relatedListData) {
        const relatedList = relatedListData.data.body.items;
        yield put({
          type: 'fetchCustomObjectDescribeSuccess',
          payload: {
            body: {
              ...describeData.data.body,
              relatedList,
            },
          },
        });

        for (const list of relatedList) {
          yield put({
            type: 'fetchRelatedObjectDescribe',
            payload: { apiName: list.object_api_name },
          });
        }
      }
    },

    *fetchRelatedObjectDescribe({ payload }, { call, put }) {
      const { data: describe } = yield call(fetchCustomObjectDescribe, payload);
      if (describe) {
        yield put({
          type: 'fetchCustomObjectDescribeSuccess',
          payload: {
            body: describe.data.body,
          },
        });
      }
    },

    *createCustomObjectDetailLayout({ payload }, { call, put }) {
      const { data } = yield call(createCustomObjectDetailLayout, payload);

      if (data) {
        yield put({
          type: 'fetchCustomObjects',
        });
        message.success('保存成功！');
      }
    },

    *editCustomObjectDetailLayout({ payload }, { call, put }) {
      const { data } = yield call(editCustomObjectDetailLayout, payload);

      if (data) {
        yield put({
          type: 'fetchCustomObjectDetailLayoutSuccess',
          payload: {
            body: data.data.body,
          },
        });
        put({
          type: 'fetchCustomObjects',
        });
        message.success('保存成功！');
      }
    },

  },
};
