import * as API from '../merchantApi';

export default {
  namespace: 'mclist',

  state: {
    list: [],
    total: 0,
    currentPage: 1,
    pageSize: 20,
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(API.queryList, payload);
      if (response) {
        yield put({
          type: 'saveList',
          payload: response,
        });
      }
    },
    *addMerchant({ payload, callback }, { call }) {
      const response = yield call(API.addMerchant, payload);
      if (callback) {
        if(response && response.status === 'ok'){
          yield callback(true);
        }else{
          yield callback(false);
        }
      }
    },
    *merchantRecharge({ payload, callback }, { call }) {
      const response = yield call(API.merchantRecharge, payload);
      if (callback) {
        if(response && response.status === 'ok'){
          yield callback(true);
        }else{
          yield callback(false);
        }
      }
    },
  },

  reducers: {
    saveList(state, { payload }) {
      const stateOld = { ...state };
      stateOld.list = payload.list;
      stateOld.total = payload.total;
      stateOld.currentPage = payload.currentPage;
      stateOld.pageSize = payload.pageSize;
      return stateOld;
    },
  },
};
