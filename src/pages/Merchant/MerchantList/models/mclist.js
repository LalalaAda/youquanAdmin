import * as API from '@/services/merchantApi';

export default {
  namespace: 'mclist',

  state: {
    list: [],
    total: 0,
    pages: 0,
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(API.queryList, payload);
      if(response){
        yield put({
          type: 'saveList',
          payload: response,
        });
      }
    },
  },

  reducers: {
    saveList(state, { payload }) {
      const stateOld = { ...state };
      stateOld.list = payload.list;
      stateOld.total = payload.total;
      return stateOld;
    },
  },
};
