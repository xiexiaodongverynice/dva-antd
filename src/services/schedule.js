import { config, request } from '../utils';

const { api } = config;

const { schedule } = api;

// 获取列表
export function fetch() {
  return request(
    `${schedule}/list/all`, {
      method: 'GET',
    });
}
// 删除
export function remove(values) {
  return request(
    `${schedule}/${values.id}`, {
      method: 'DELETE',
      body: values,
    });
}
// 根据id 获取
export function fetchById(id) {
  return request(
    `${schedule}/${id}`, {
      method: 'GET',
    });
}
// 新增
export function create(values) {
  return request(
    `${schedule}/`, {
      method: 'POST',
      body: values,
    });
}
// 修改
export function update(value) {
  return request(
    `${schedule}/${value.id}`, {
      method: 'PUT',
      body: value,
    });
}


