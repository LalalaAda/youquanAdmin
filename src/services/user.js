import request from '@/utils/request';

export async function accountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function queryUsers() {
  return request('/api/user/users');
}

export async function queryCurrent() {
  return request('/api/user/currentuser');
}
