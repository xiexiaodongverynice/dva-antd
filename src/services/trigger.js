import _ from 'lodash';
import { config, request } from '../utils';
import { joinParams } from '../utils/custom_util';

const { api } = config;
const { trigger_page } = api;


export function fetchAllObj() {
  return request(
    '/rest/metadata/object_describe/all', {
      method: 'GET',
    });
}

export function create(obj) {
  return request(
    '/trigger', {
      method: 'POST',
      body: obj,
    });
}


export function api_name_list(api_name) {
  return request(
    `/trigger/list/${api_name}`, {
      method: 'GET',
    });
}


export function del(id) {
  return request(
    `/trigger/${id}`, {
      method: 'DELETE',
    });
}

export function update(values) {
  return request(
    '/trigger', {
      method: 'PUT',
      body: values,
    });
}

export function open(openObj) {
  return request(
    `/trigger/${openObj.id}/${openObj.state}`, {
      method: 'PUT',
      body: [],
    });
}

// 分页查询
export function fetchWithPage(values) {
  return request(`${trigger_page}/${values.pageSize}/${values.pageNo}?${joinParams(_.omit(values, ['pageNo', 'pageSize']))}`);
}

export function query(id) {
  return request(`/trigger/${id}`);
}
