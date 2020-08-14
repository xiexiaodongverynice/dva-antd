// 布局相关请求服务
import { config, request } from '../utils';

// api
const { api } = config;
const { kpiDef, kpiAssign } = api;


// 查询布局列表
export function fetch() {
  return request(
    `${kpiDef}/list/all`, {
      method: 'GET',
    });
}

// 根据id查询
export function loadById(id) {
  return request(
    `${kpiDef}/${id}`, {
      method: 'GET',
    });
}


// 新增
export function create(values) {
  return request(
    `${kpiDef}/`, {
      method: 'POST',
      body: values,
    });
}

// 删除
export function deleteItem(id) {
  return request(
    `${kpiDef}/${id}`, {
      method: 'DELETE',
    });
}

// 修改
export function update(values) {
  return request(
    `${kpiDef}/${values.id}`, {
      method: 'PUT',
      body: values,
    });
}

// 获取kpi下的所有简档
export function listProfiles(kpiApiName) {
  return request(
    `${kpiAssign}/${kpiApiName}`, {
      method: 'GET',
    },
  );
}

// kpi分配简档
export function updateAssign(kpiApiName, profileApiNames) {
  return request(
    `${kpiAssign}/assign`, {
      method: 'POST',
      body: {
        kpiApiName,
        profileApiNames,
      },
    });
}

