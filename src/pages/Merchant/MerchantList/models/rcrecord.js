// 商户预存款记录
import * as API from '../merchantApi';

export default {
  namespace: 'rcrecord',

  state: {
    list: [],
    total: 0,
    pageSize: 20,
    currentPage: 1,
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(API.queryRechargeRecord, payload);
      if(response&&response.status==="ok"){
        yield put({
          type: 'saveList',
          payload: response,
        });
      }
    },
    *updateRecordStatus({ payload, callback }, { call }){
      const response = yield call(API.updateRecordStatus, payload);
      if(callback){
        if(response&&response.status==="ok"){
          yield callback(true);
          // TODO 更新当前的List
        }else{
          yield callback(false);
        }
      }
    }
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
