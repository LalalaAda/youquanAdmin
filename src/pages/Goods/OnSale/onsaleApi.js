import request from '@/utils/request';

export async function queryList(params) {
  return request('/api/goods/onsale/list', {
    method: 'GET',
    // GET 方式带的值 字段为params
    params,
  });
}

export async function queryDetail(params) {
  return request('/api/goods/onsale/detail', {
    method: 'POST',
    data: params
  });
}

// 编辑详情
export async function update(params){
  return request('/api/goods/onsale/update', {
    method: 'POST',
    data: params
  });
}
// 更新价格
export async function changePrice(params){
  return request('/api/goods/onsale/changeprice', {
    method: 'POST',
    data: params
  });
}
