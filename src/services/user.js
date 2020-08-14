import { config, request } from '../utils';
import { pickValues } from '../utils/custom_util';

const { api } = config;

const { user_query } = api;
const { user_data } = api;
const { sub_baseUrl } = api;
const { common_query } = api;

export function fetch(values) {
  return request(
    `${user_data}/${values.pageSize}/${values.pageNo}`, {
      method: 'POST',
      body: pickValues(values),
    });
}

export function search(values) {
  return request(
    `${user_query}/${values.pageSize}/1`, {
      method: 'POST',
      body: pickValues(values),
    });
}

export const resetPassword = (values) => {
  return request(
    '/rest/user_info/resets', {
      method: 'PUT',
      body: values,
    });
};

export const getUserInfoByUserId = (values) => {
  return request(
    `${user_data}/${values.id}`, {
      method: 'GET',
    });
};

export function query(q) {
  return request(
    `${common_query}`, {
      method: 'POST',
      body: q,
    },
  );
}

export function register(values) {
  return request(
    `${user_data}`, {
      method: 'POST',
      body: values,
    });
}

export function edit(values) {
  return request(
    `${user_data}/${values.id}`, {
      method: 'PUT',
      body: values,
    });
}

export const getRoleList = () => {
  return request(
    `${sub_baseUrl}/role`, {
      method: 'GET',
    });
};

export const getDutyList = () => {
  return request(
    `${sub_baseUrl}/duty`, {
      method: 'GET',
    });
};

export const getDeptList = () => {
  return request(
    `${sub_baseUrl}/department`, {
      method: 'GET',
    });
};

export const getProfileList = () => {
  return request(
    `${sub_baseUrl}/profile`, {
      method: 'GET',
    });
};

export const removeGroupByUserPermissionSet = (values) => {
  return request(
   `${sub_baseUrl}/user_permission_set/${values.id}`, {
     method: 'DELETE',
   });
};

export const getUserDetailByUserId = (values) => {
  return request(
    `/rest/user_info/${values.id}`, {
      method: 'GET',
    });
};

export const userActive = (values) => {
  return request(
      '/rest/user_info/enables', {
        method: 'PUT',
        body: values,
      });
};

// 删除
export function deleteUser(id) {
  return request(
    `${user_data}/${id}`, {
      method: 'DELETE',
    });
}

