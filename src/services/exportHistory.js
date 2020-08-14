import { request } from '../utils';
import * as config from '../utils/config';
import { pickValues } from '../utils/custom_util';

const { DATA_EXPORT_BASE, data_export_api, FS, fs_api } = config;
const { export_history, export_history_log } = data_export_api;

export function fetch(values) {
    return request(
        `${DATA_EXPORT_BASE}/${export_history}/${values.pageSize}/${values.pageNo}`, {
            method: 'POST',
            body: pickValues(values),
        });
}

// 删除
export function del(values) {
    return request(
      `${DATA_EXPORT_BASE}/${export_history}/${values.id}`, {
        method: 'DELETE',
        body: values,
      });
  }
// 根据id 获取
export function fetchById(id) {
  return request(
    `${DATA_EXPORT_BASE}/${export_history}/${id}`, {
      method: 'GET',
    });
}
// 新增
export function create(values) {
  return request(
    `${DATA_EXPORT_BASE}/${export_history}/`, {
      method: 'POST',
      body: values,
    });
}
// 修改
export function update(value) {
  return request(
    `${DATA_EXPORT_BASE}/${export_history}/${value.id}`, {
      method: 'PUT',
      body: value,
    });
}

export function download(file_key) {
  window.open(`${FS}${fs_api.files}${file_key}?token=${localStorage.getItem('token')}&ask_file_name=true`);
}

export function fetchLogByExportHistoryId(id) {
  return request(
    `${DATA_EXPORT_BASE}/${export_history_log}/${id}`, {
      method: 'GET',
    });
}