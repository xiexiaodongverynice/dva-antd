import { config, request } from '../utils';

const { api, baseURL } = config;

const { tenant_setting } = api;

// 获取列表
export function fetchAll() {
  return request(
    `${tenant_setting}/list/all`, {
      method: 'GET',
    });
}
// 删除
export function deletSetting(values) {
  return request(
    `${tenant_setting}/${values.id}`, {
      method: 'DELETE',
      body: values,
    });
}
// 根据apiName 获取
export function fetchSetting(apiName) {
  return request(
    `${tenant_setting}/${apiName}`, {
      method: 'GET',
    });
}
// 新增
export function create(values) {
  return request(
    `${tenant_setting}/`, {
      method: 'POST',
      body: values,
    });
}
// 修改
export function updateSetting(value) {
  return request(
    `${tenant_setting}/${value.id}`, {
      method: 'PUT',
      body: value,
    });
}

export function createOrUpdate(value) {
  if (value.id) {
    return updateSetting(value);
  } else {
    return create(value);
  }
}
export function getBatchdcrstatus() {
  return request(
    `${tenant_setting}/batch_dcrstatus`, {
      method: 'GET',
    });
}


export const uploadLogoUrl = `${baseURL}/${tenant_setting}/uploadLogo`;
