import { config, request } from '../utils';

const { api } = config;

const { group } = api;

const { metadata_baseUrl } = api;


export const getObjectList = () => {
  return request(
    `${metadata_baseUrl}/object_describe/all`, {
      method: 'GET',
    });
};

export const getObjectFieldList = (values) => {
  return request(
    `${metadata_baseUrl}/object_describe/${values}/fields`, {
      method: 'GET',
    });
};

export const getGroupById = (values) => {
  return request(
    `/${group}/${values.id}`, {
      method: 'GET',
    });
};


export function editGroup(values) {
  return request(
    `${group}/${values.id}`, {
      method: 'PUT',
      body: values,
    });
}

