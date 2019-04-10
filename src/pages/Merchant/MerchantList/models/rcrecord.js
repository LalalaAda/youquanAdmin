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
    *updateRechargeRecord({ payload, callback }, { call, put }){
      const response = yield call(API.updateRechargeRecord, payload);
      if(callback){
        if(response&&response.status==="ok"){
          yield callback(true);
          yield put({
            type: 'filterList',
            payload
          });
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
    filterList(state, { payload }) {
      const oldState = { ...state };
      const nlist = oldState.list.filter(item => {
        const newitem = item;
        if(newitem.id === payload.id){
          newitem.status = payload.status;
        }
        return newitem;
      });
      oldState.list = nlist;
      return oldState;
    }
  },
};
