import { config, request } from '../utils';

const { api } = config;

const { action_script } = api;

// 获取列表
export function fetch() {
  return request(
    `${action_script}/`, {
      method: 'GET',
    });
}
// 删除
export function remove(values) {
  return request(
    `${action_script}/${values.id}`, {
      method: 'DELETE',
      body: values,
    });
}
// 根据id 获取
export function fetchById(id) {
  return request(
    `${action_script}/${id}`, {
      method: 'GET',
    });
}
// 新增
export function create(values) {
  return request(
    `${action_script}/`, {
      method: 'POST',
      body: values,
    });
}
// 修改
export function update(value) {
  return request(
    `${action_script}/${value.id}`, {
      method: 'PUT',
      body: value,
    });
}


