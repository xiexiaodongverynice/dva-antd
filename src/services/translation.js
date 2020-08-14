import { config, request } from '../utils';

const { api } = config;

const { translation } = api;

// 获取列表
export function fetch() {
  return request(
    `${translation}/all`, {
      method: 'GET',
    });
}
// 删除
export function del(values) {
  return request(
    `${translation}/${values.id}`, {
      method: 'DELETE',
      body: values,
    });
}
// 根据id 获取
export function fetchById(id) {
  return request(
    `${translation}/${id}`, {
      method: 'GET',
    });
}
// 新增
export function create(values) {
  return request(
    `${translation}/`, {
      method: 'POST',
      body: values,
    });
}
// 修改
export function update(value) {
  return request(
    `${translation}/${value.id}`, {
      method: 'PUT',
      body: value,
    });
}

