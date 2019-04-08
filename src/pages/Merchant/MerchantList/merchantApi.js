import request from '@/utils/request';

export async function queryList(params) {
  return request('/api/merchant/list', {
    method: 'GET',
    // GET 方式带的值 字段为params
    params,
  });
}

export async function addMerchant(params) {
  return request('/api/merchant/addmerchant', {
    method: 'POST',
    data: params
  });
}

export async function merchantRecharge(params) {
  return request('/api/merchant/merchantrecharge', {
    method: 'POST',
    data: params
  });
}


// 充值记录
export async function queryRechargeRecord(params) {
  return request('/api/merchant/rechargerecord', {
    method: 'GET',
    params,
  });
}
