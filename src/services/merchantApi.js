import request from '@/utils/request';

export async function queryList(params) {
  return request('/api/merchant/list', {
    method: 'GET',
    // GET 方式带的值 字段为params
    params,
  });
}

export async function queryRechargeRecord(params) {
  return request('/api/merchant/rechargerecord', {
    method: 'POST',
    data: params,
  });
}