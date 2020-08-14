import { config, request } from '../utils';

const { api } = config;

const { function_permission } = api;

// 获取列表
export function fetch() {
  return request(
    `${function_permission}/`, {
      method: 'GET',
    });
}
// 删除
export function deleteFunctionPermission(values) {
  return request(
    `${function_permission}/${values.id}`, {
      method: 'DELETE',
      body: values,
    });
}
// 根据id 获取
export function fetchFunctionPermission(id) {
  return request(
    `${function_permission}/${id}`, {
      method: 'GET',
    });
}
// 新增
export function create(values) {
  return request(
    `${function_permission}/`, {
      method: 'POST',
      body: values,
    });
}
// 修改
export function updateTab(value) {
  return request(
    `${function_permission}/${value.id}`, {
      method: 'PUT',
      body: value,
    });
}

