/**
 * Created by Administrator on 2017/5/16 0016.
 */
import _ from 'lodash';
import request from '../utils/request_custom';
import config from '../utils/config';
import { PAGE_SIZE } from '../constants';

const { api } = config;
const { custom_object, custom_objects_all, custom_objects_page, tab } = api;

export function fetch({ page }) {
  const params = { _page: page, _limit: PAGE_SIZE, includeFields: page.includeFields };
  return request({
    url: custom_objects_all,
    method: 'get',
    data: params,
  });

 /* return request(`${custom_objects}`,{
    method: 'GET',
    data: JSON.stringify({_page:page,_limit:PAGE_SIZE})
  });*/
 /* return request(`${custom_objects}?_page=${page}&_limit=${PAGE_SIZE}`,{
    method:'GET'
  });*/
}

// 分页查询
export function fetchWithPage(params = {}) {
  return request({
    url: `${custom_objects_page}/${params.pageSize}/${params.pageNo}`,
    data: _.pick(params, ['includeFields', 'display_name']),
  });
}

export function fetchAll() {
  return request({
    url: custom_objects_all,
    method: 'get',
    data: { includeFields: false },
  });
}


export function fetchAllIncludeFields() {
  return request({
    url: custom_objects_all,
    method: 'get',
    data: { includeFields: true },
  });

  /* return request(`${custom_objects}`,{
   method: 'GET',
   data: JSON.stringify({_page:page,_limit:PAGE_SIZE})
   });*/
  /* return request(`${custom_objects}?_page=${page}&_limit=${PAGE_SIZE}`,{
   method:'GET'
   });*/
}

export function remove(id) {
  return request(
    {
      url: custom_object.replace(':id', id),
      method: 'DELETE',
    });
}
export function patch(id, values) {
  return request({
    url: custom_object.replace(':id', id),
    method: 'patch',
    data: values,
  });
}
export function put(id, values) {
  return request({
    url: custom_object.replace(':id', id),
    method: 'put',
    data: values,
  });
}
export function create(values) {
  // alert("service create")
  return request({
    url: custom_object.replace(':id', ''),
    method: 'POST',
    data: values,
  });
 /* return request('/api/users', {
    method: 'POST',
    body: JSON.stringify(values),
  });*/
}
export function fetchByApiName(values, includeFields = true) {
  const url = `${custom_object.replace(':id', values.object_api_name)}?includeFields=${includeFields}`;
  return request({
    url,
    method: 'GET',
  });
}

export function updateTab(value) {
  return request(
    `${tab}/${value.id}`, {
      method: 'PUT',
      body: value,
    });
}
