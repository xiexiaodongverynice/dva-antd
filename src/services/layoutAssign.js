// 布局相关请求服务
import { config, request } from '../utils';
import { joinParams } from '../utils/custom_util';

// api
const { api } = config;
const { layout_assign: layoutAssignURL } = api;


// 查询布局列表
export function fetch() {
  return request(
    `${layoutAssignURL}/list/all`, {
      method: 'GET',
    });
}

// 根据id查询
export function loadById(id) {
  return request(
    `${layoutAssignURL}/${id}`, {
      method: 'GET',
    });
}


// 新增
export function create(values) {
  return request(
    `${layoutAssignURL}/`, {
      method: 'POST',
      body: values,
    });
}

// 删除
export function deleteLayoutAssign(id) {
  return request(
    `${layoutAssignURL}/${id}`, {
      method: 'DELETE',
    });
}

// 修改
export function update(values) {
  return request(
    `${layoutAssignURL}/${values.id}`, {
      method: 'PUT',
      body: values,
    });
}

// 新增或修改
export function createOrUpdate(values) {
  return values.id ? update(values) : create(values);
}

export function findBy(values) {
  return request(`${layoutAssignURL}/find_by?${joinParams(values)}`);
}

