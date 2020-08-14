/**
 * Created by Administrator on 2017/5/16 0016.
 */
import _ from 'lodash';
import request from '../utils/request_custom';
import { PAGE_SIZE } from '../constants';
import config from '../utils/config';

const { api } = config;
const { custom_field, custom_all_fields, custom_fields_page } = api;


export function fetch({ objId, page }) {
  const params = { _page: page, _limit: PAGE_SIZE };
  return request({
    url: custom_all_fields.replace(':objId', objId),
    method: 'get',
    data: params,
  });
}

// 获取分页字段列表
export function fetchWithPage(params) {
  const { objId, pageNo, pageSize } = params;
  return request({
    url: `${custom_fields_page.replace(':objId', objId)}/${pageSize}/${pageNo}`,
    method: 'get',
    data: _.pick(params, ['label']),
  });
}

export function remove({ objId, id }) {
  return request({
    url: custom_field.replace(':objId', objId).replace(':id', id),
    method: 'DELETE',
  });
}
export function patch({ objId, values }) {
  return request({
    url: custom_field.replace(':objId', objId),
    method: 'PATCH',
    data: values,
  });
}
export function put({ objId, id, values }) {
  return request({
    url: custom_field.replace(':objId', objId).replace(':id', id),
    method: 'PUT',
    data: values,
  });
}
export function create({ objId, values }) {
  return request({
    url: custom_all_fields.replace(':objId', objId),
    method: 'POST',
    data: values,
  });
}
