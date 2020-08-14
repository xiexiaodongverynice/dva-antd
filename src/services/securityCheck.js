import { config, request } from '../utils';

const { api } = config;

const { security_check } = api;

// 获取列表
export function fetch() {
  return request(
    `${security_check}/`, {
      method: 'GET',
    });
}
// 删除
export function remove(values) {
  return request(
    `${security_check}/${values.id}`, {
      method: 'DELETE',
      body: values,
    });
}
// 根据id 获取
export function fetchById(id) {
  return request(
    `${security_check}/${id}`, {
      method: 'GET',
    });
}
// 新增
export function create(values) {
  return request(
    `${security_check}/`, {
      method: 'POST',
      body: values,
    });
}
// 修改
export function update(value) {
  return request(
    `${security_check}/${value.id}`, {
      method: 'PUT',
      body: value,
    });
}

// 初始化安全策略
export function init() {
  return request(
    `${security_check}/init`, {
      method: 'POST',
      body: {},
    },
  );
}

