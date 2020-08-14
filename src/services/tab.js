import _ from 'lodash';
import { config, request } from '../utils';

const { api } = config;

const { tab } = api;

// 获取列表
export function fetch(payload) {
  const url = `${tab}/?label=${_.get(payload, 'label', '')}`;
  return request(url, {
    method: 'GET',
  });
}
// 删除
export function deleteTab(values) {
  return request(`${tab}/${values.id}`, {
    method: 'DELETE',
    body: values,
  });
}
// 根据id 获取
export function fetchTab(id) {
  return request(`${tab}/${id}`, {
    method: 'GET',
  });
}
// 新增
export function create(values) {
  return request(`${tab}/`, {
    method: 'POST',
    body: values,
  });
}
// 修改
export function updateTab(value) {
  return request(`${tab}/${value.id}`, {
    method: 'PUT',
    body: value,
  });
}
// 修改
export function updateTabs(value) {
  return request(`${tab}/`, {
    method: 'PUT',
    body: { data: value },
  });
}
