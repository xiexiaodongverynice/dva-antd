import { config, request } from '../utils';

const { api } = config;

const { ssoquery, authquery, oauthquery } = api;

// 获取列表
export function fetch() {
  return request(`${ssoquery}/all`, {
    method: 'GET',
  });
}
// 新建
export function newconstruction(values) {
  return request(`${ssoquery}/`, {
    method: 'POST',
    body: values,
  });
}
// 根据id 获取
export function fetchById(value) {
  return request(`${ssoquery}/${value.id}`, {
    method: 'GET',
  });
}
// 删除
export function deleteQuery(value) {
  return request(`${ssoquery}/${value.id}`, {
    method: 'DELETE',
    body: value,
  });
}
// 修改
export function update(value) {
  return request(`${ssoquery}/${value.id}`, {
    method: 'PUT',
    body: value,
  });
}
// 认证方式
export function authenquery() {
  return request(`${authquery}/all`, {
    method: 'GET',
  });
}
// 认证方式保存
export function authensave(value) {
  return request(`${authquery}/`, {
    method: 'POST',
    body: value,
  });
}
// 认证修改
export function anuthupdate(value, id) {
  return request(`${authquery}/${id}`, {
    method: 'PUT',
    body: value,
  });
}
// oauth获取列表
export function oauthfetch() {
  return request(`${oauthquery}/all`, {
    method: 'GET',
  });
}
// oauth新建
export function oauthnewconstruction(values) {
  return request(`${oauthquery}/`, {
    method: 'POST',
    body: values,
  });
}
// oauth根据id 获取
export function oauthfetchById(value) {
  return request(`${oauthquery}/${value.id}`, {
    method: 'GET',
  });
}
// oauth删除
export function oauthdeleteQuery(value) {
  return request(`${oauthquery}/${value.id}`, {
    method: 'DELETE',
    body: value,
  });
}
// oauth修改
export function oauthupdate(value) {
  return request(`${oauthquery}/${value.id}`, {
    method: 'PUT',
    body: value,
  });
}
