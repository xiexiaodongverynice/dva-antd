import { config, request } from '../utils';

const { api } = config;

const { approval_flow } = api;

// 获取列表
export function fetch() {
  return request(
    `${approval_flow}/`, {
      method: 'GET',
    });
}
// 删除
export function remove(values) {
  return request(
    `${approval_flow}/${values.id}`, {
      method: 'DELETE',
      body: values,
    });
}
// 根据id 获取
export function fetchById(id) {
  return request(
    `${approval_flow}/${id}`, {
      method: 'GET',
    });
}
// 新增
export function create(values) {
  return request(
    `${approval_flow}/`, {
      method: 'POST',
      body: values,
    });
}
// 修改
export function update(value) {
  return request(
    `${approval_flow}/${value.id}`, {
      method: 'PUT',
      body: value,
    });
}

// 初始化审批流
export function init() {
  return request(
    `${approval_flow}/init/`, {
      method: 'POST',
      body: {},
    },
  );
}

// 在业务对象上启用工作流
export function enableApprovalOnObject(value) {
  return request(
    `${approval_flow}/enable/`, {
      method: 'POST',
      body: Object.assign({}, value),
    },
  );
}

