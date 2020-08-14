import { config, request } from '../utils';
import { pickValues } from '../utils/custom_util';

const { api } = config;

const { profile_data } = api;
const { profile_query, profile_configuration } = api;
const { metadata_baseUrl } = api;

// const  token = sessionStorage.getItem('token');

// 没有检索查询简档
export const getSimpleProfile = (values) => {
  return request(
    `${profile_data}/${values.pageSize}/${values.pageNo}`, {
      method: 'POST',
      body: pickValues(values),
    });
};

// 根据检索条件查询简档
export const searchSimpleProfile = (values) => {
  return request(
    `${profile_query}/10/1`, {
      method: 'POST',
      body: values,
    });
};

// 获得所有简档
export const getSimpleProfileList = () => {
  return request(
    `${profile_data}`, {
      method: 'GET',
    });
};

// 添加简档
export const addSimpleProfile = (values) => {
  return request(
    `${profile_data}`, {
      method: 'POST',
      body: values,
    });
};

// 删除简档
export const deleteSimpleProfile = (values) => {
  return request(
    `${profile_data}/${values.id}`, {
      method: 'DELETE',
    });
};

export function editSimpleProfile(values) {
  return request(
    `${profile_data}/${values.id}`, {
      method: 'PUT',
      body: values,
    });
}

// 取得对象描述
export const getObjectList = () => {
  return request(
    `${metadata_baseUrl}/object_describe/all`, {
      method: 'GET',
    });
};

// 取得对象描述字段
export const getObjectFieldList = (values) => {
  return request(
    `${metadata_baseUrl}/object_describe/${values.objectId}/fields`, {
      method: 'GET',
    });
};

export const getSimpleProfileById = (values) => {
  return request(
    `${profile_data}/${values.id}?filterByProfile=true`, {
      method: 'GET',
    });
};
// export const getQuery = (values) => {
//   return request(
//     `${profile_configuration}/${values.profile}/${values.apiName}/${values.fieldApiName}`, {
//       method: 'POST',
//       body: {
//         data: values.data,
//       },
//     });
// };

