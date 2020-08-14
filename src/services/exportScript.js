import { request } from '../utils';
import * as config from '../utils/config';
import { pickValues } from '../utils/custom_util';

const { DATA_EXPORT_BASE, data_export_api } = config;
const { export_script, export_script_async } = data_export_api;

export function fetch(values) {
    return request(
        `${DATA_EXPORT_BASE}/${export_script}/${values.pageSize}/${values.pageNo}`, {
            method: 'POST',
            body: pickValues(values),
        });
}

// 删除
export function del(values) {
    return request(
      `${DATA_EXPORT_BASE}/${export_script}/${values.id}`, {
        method: 'DELETE',
        body: values,
      });
  }
  // 根据id 获取
  export function fetchById(id) {
    return request(
      `${DATA_EXPORT_BASE}/${export_script}/${id}`, {
        method: 'GET',
      });
  }
  // 新增
  export function create(values) {
    return request(
      `${DATA_EXPORT_BASE}/${export_script}/`, {
        method: 'POST',
        body: values,
      });
  }
  // 修改
  export function update(value) {
    return request(
      `${DATA_EXPORT_BASE}/${export_script}/${value.id}`, {
        method: 'PUT',
        body: value,
      });
  }

  export function run(values) {
    return request(
      `${DATA_EXPORT_BASE}/${export_script_async}/${values.id}/run`, {
        method: 'GET',
      });
  }