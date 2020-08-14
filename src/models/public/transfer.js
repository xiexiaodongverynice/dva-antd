import * as roleTransferService from '../../services/tra';

export default {
  namespace: 'roleTransfer',
  state: {
    role: [],
    mockData: [],
    targetKeys: [],
    oldTargetKeys: [],
    targetBodyObj: [],
    config: {
      id: '',
      name: '',
      indexName: '',
      api_name: '',
      fieldName: '',
    },
  },
  reducers: {
    save(state, { payload: { role } }) {
      return { ...state, role };
    },
    saveConfig(state, { payload: { config, role, mockData, targetKeys, targetBodyObj } }) {
      return { ...state, config, role, mockData, targetKeys, targetBodyObj };
    },
    saveUser(state, { payload: { mockData, targetKeys, oldTargetKeys, targetBodyObj } }) {
      return { ...state, mockData, targetKeys, oldTargetKeys, targetBodyObj };
    },
    TransferSave(state, { payload: { targetKeys } }) {
      return { ...state, targetKeys };
    },
  },
  effects: {
    *fetch({ payload: query }, { call, put }) {
      yield put({
        type: 'saveConfig',
        payload: {
          config: query,
          role: [],
          mockData: [],
          targetKeys: [],
          targetBodyObj: [],
        },
      });
      if (query.group === undefined) {
        const { data } = yield call(roleTransferService.fetchAll, query);
        if (data) {
          if (!data.data.body.result) {
            data.data.body.result = [];
          }
          const isBody = [];
          for (let i = 0; i < data.data.body.result.length; i += 1) {
            if (query.id !== data.data.body.result[i].id) {
              isBody.unshift(data.data.body.result[i]);
            }
          }
          yield put({
            type: 'save',
            payload: {
              role: isBody,
            },
          });
        }
      }
    },
    *fetchUser({ payload: { id, config } }, { call, put }) {
      const { data } = yield call(roleTransferService.isUser, { id, config });
      let list = {};
      if (config.group) {
        list = yield call(roleTransferService.groupUser, { id: config.id, config });
      } else {
        list = yield call(roleTransferService.isUser, { id: config.id, config });
      }
      if (data && list) {
        if (!data.data.body.result) {
          data.data.body.result = [];
        }
        if (!list.data.data.body.result) {
          list.data.data.body.result = [];
        }
        const isTargetBody = [];
        for (let i = 0; i < list.data.data.body.result.length; i += 1) {
          let num = 0;
          isTargetBody.unshift(list.data.data.body.result[i].id);
          for (let x = 0; x < data.data.body.result.length; x += 1) {
            if (data.data.body.result[x].id === list.data.data.body.result[i].id) {
              num += 1;
            }
          }
          if (num === 0) {
            data.data.body.result.unshift(list.data.data.body.result[i]);
          }
        }
        yield put({
          type: 'saveUser',
          payload: {
            mockData: data.data.body.result,
            targetKeys: isTargetBody,
            oldTargetKeys: isTargetBody,
            targetBodyObj: list.data.data.body.result,
          },
        });
      }
    },
    *TransferR({ payload: { targetKeys } }, { put }) {
      yield put({
        type: 'TransferSave',
        payload: {
          targetKeys,
        },
      });
    },
    *Distribution({ payload: { body, config, old, oldTargetKeys } }, { call }) {
      const newBody = [];
      /* 分配角色/部门/职务给用户，根据body中的id从old中获取用户ID和version*/
      for (let i = 0; i < body.length; i += 1) {
        for (let x = 0; x < old.length; x += 1) {
          if (body[i] === old[x].id) {
            const isBody = {
              id: parseInt(old[x].id, 10),
              version: old[x].version,
            };

            isBody[config.fieldName] = parseInt(config.id, 10);
            newBody.unshift(isBody);
          }
        }
      }
      /* 是否取消角色/部门/职务，如果取消，将[config.fieldName]置为空*/
      for (let i = 0; i < oldTargetKeys.length; i += 1) {
        let num = 0;
        for (let x = 0; x < body.length; x += 1) {
          if (body[x] === oldTargetKeys[i]) {
            num += 1;
          }
        }
        if (num === 0) {
          for (let y = 0; y < old.length; y += 1) {
            if (oldTargetKeys[i] === old[y].id) {
              const isBody = {
                id: parseInt(old[y].id, 10),
                version: old[y].version,
              };

              isBody[config.fieldName] = null;
              newBody.unshift(isBody);
            }
          }
        }
      }

      const { data } = yield call(roleTransferService.saveDistribution, newBody, config);
      if (data) {
        window.history.back();
      }
    },
    *DistributionGroup({ payload: { body, config, old, targetBodyObj } }, { call }) {
      const newBody = [];
      const removeBody = [];
      /* 分配权限组，根据body中的id从old中获取用户ID和version*/
      for (let i = 0; i < body.length; i += 1) {
        let add = true;
        for (let x = 0; x < targetBodyObj.length; x += 1) {
          if (body[i] === targetBodyObj[x].id) {
            add = false;
          }
        }
        if (add) {
          const isBody = {
            user_info: parseInt(body[i], 10),
          };
          isBody[config.fieldName] = parseInt(config.id, 10);
          newBody.unshift(isBody);
        }
      }
      for (let i = 0; i < targetBodyObj.length; i += 1) {
        let num = 0;
        for (let x = 0; x < body.length; x += 1) {
          if (body[x] === targetBodyObj[i].id) {
            num += 1;
          }
        }
        if (num === 0) {
          const isBody = parseInt(targetBodyObj[i].user_info_permission_set, 10);
          removeBody.unshift(isBody);
        }
      }
      const myBody = {
        add: newBody,
        remove: removeBody,
      };
      const { data } = yield call(roleTransferService.saveDistributionGroup, myBody, config);
      if (data) {
        window.history.back();
      }
    },

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/role/distribution') {
          dispatch({ type: 'fetch', payload: query });
          dispatch({ type: 'fetchUser', payload: { id: '', config: query } });
        }
        if (pathname === '/profile/distribution') {
          dispatch({ type: 'fetch', payload: query });
          dispatch({ type: 'fetchUser', payload: { id: '', config: query } });
        }
        if (pathname === '/group/distribution') {
          dispatch({ type: 'fetch', payload: query });
          dispatch({ type: 'fetchUser', payload: { id: '', config: query } });
        }
        if (pathname === '/department/distribution') {
          dispatch({ type: 'fetch', payload: query });
          dispatch({ type: 'fetchUser', payload: { id: '', config: query } });
        }
        if (pathname === '/duties/distribution') {
          dispatch({ type: 'fetch', payload: query });
          dispatch({ type: 'fetchUser', payload: { id: '', config: query } });
        }
      });
    },
  },

};
