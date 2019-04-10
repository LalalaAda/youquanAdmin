// 在售虚拟商品
import * as API from './onsaleApi';

export default {
  namespace: 'onsale',
  state: {
    list: [],
    total: 0,
    pageSize: 50,
    currentPage: 1,
    detail: {}
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(API.queryList, payload);
      if(response&&response.status==="ok"){
        yield put({
          type: 'saveList',
          payload: response,
        });
      }
    },
    *changePrice({ payload, callback }, { call, put }){
      const response = yield call(API.changePrice, payload);
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
    },
    *fetchItem({ payload }, { call, put }) {
      const res = yield call(API.queryDetail, payload);
      if(res&&res.status==="ok"){
        yield put({
          type: 'saveList',
          payload: res
        });
      }
    },
    *updateItem({ payload, callback }, { call }){
      const res = yield call(API.update, payload);
      if(callback){
        if(res&&res.status==="ok"){
          yield callback(true);
        }else{
          yield callback(false);
        }
      }
    },

  },

  reducers: {
    saveList(state, { payload }) {
      return {
        ...state,
        list: payload.list,
        total: payload.total,
        currentPage: payload.currentPage
      }
    },
    filterList(state, { payload }) {
      const oldState = { ...state };
      const nlist = oldState.list.filter(item => {
        const newitem = item;
        if(newitem.id === payload.id){
          newitem.price = payload.price;
        }
        return newitem;
      });
      oldState.list = nlist;
      return oldState;
    },
    
  },
};
