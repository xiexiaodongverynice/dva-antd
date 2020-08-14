import { config, request } from '../utils';

const { api } = config;

const { sequence } = api;

// 获取列表
export function fetch() {
  return request(
    `${sequence}/`, {
      method: 'GET',
    });
}
// 删除
export function deleteSequence(values) {
  return request(
    `${sequence}/${values.id}`, {
      method: 'DELETE',
      body: values,
    });
}
// 根据id 获取
export function fetchSequence(id) {
  return request(
    `${sequence}/${id}`, {
      method: 'GET',
    });
}
// 新增
export function create(values) {
  return request(
    `${sequence}/`, {
      method: 'POST',
      body: values,
    });
}
// 修改
export function updateSequence(value) {
  return request(
    `${sequence}/${value.id}`, {
      method: 'PUT',
      body: value,
    });
}
// 修改
export function resetSequence(value) {
  return request(
    `${sequence}/reset/${value.id}`, {
      method: 'POST',
      body: value,
    });
}

