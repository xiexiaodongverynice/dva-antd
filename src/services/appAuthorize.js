import _ from 'lodash';
import { config, request } from '../utils';

const { api } = config;

const { op_app_list, tenant_setting } = api;

// 获取op端app应用列表
export function fetchAppOptionsList(payload) {
  const url = `${op_app_list}`;
  return request(url, {
    method: 'GET',
  });
}

// 获取菜单
export function fetchTabOptionsList(payload) {
  const type = _.get(payload, 'type');
  const url = `${tenant_setting}/list/type/${type}`;
  return request(url, {
    method: 'GET',
  });
}

// // 删除
// export function deleteTab(values) {
//   return request(`${tab}/${values.id}`, {
//     method: 'DELETE',
//     body: values,
//   });
// }
// // 根据id 获取
// export function fetchTab(id) {
//   return request(`${tab}/${id}`, {
//     method: 'GET',
//   });
// }
// // 新增
// export function create(values) {
//   return request(`${tab}/`, {
//     method: 'POST',
//     body: values,
//   });
// }
// // 修改
// export function updateTab(value) {
//   return request(`${tab}/${value.id}`, {
//     method: 'PUT',
//     body: value,
//   });
// }
// // 修改
// export function updateTabs(value) {
//   return request(`${tab}/`, {
//     method: 'PUT',
//     body: { data: value },
//   });
// }
