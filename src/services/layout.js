// 布局相关请求服务
import { config, request } from '../utils';

// api
const { api } = config;
const { custom_object_layout: customObjectLayout } = api;


// 查询布局列表
export function fetch() {
  return request(
    '/rest/metadata/layout/list/all', {
      method: 'GET',
    });
}

// 根据id查询
export function loadById(id) {
  return request(
    `${customObjectLayout}/${id}`, {
      method: 'GET',
    });
}


// 新增
export function create(values) {
  return request(
    `${customObjectLayout}/`, {
      method: 'POST',
      body: values,
    });
}

// 删除
export function deleteLayout(id) {
  return request(
    `${customObjectLayout}/${id}`, {
      method: 'DELETE',
    });
}

// 修改
export function updateLayout(values) {
  return request(
    `${customObjectLayout}/${values.id}`, {
      method: 'PUT',
      body: values,
    });
}

