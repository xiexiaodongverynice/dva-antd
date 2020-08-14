import { config, request } from '../utils';

const { api } = config;
const { custom_objects_all: customObjectsAll,
        custom_object_layout: customObjectLayout,
        custom_object: customObject } = api;

export function fetchCustomObjects() {
  return request(
    `${customObjectsAll}`, {
      method: 'GET',
    });
}

export function fetchCustomObjectDescribe({ apiName }) {
  return request(
    `${customObject.replace(':id', apiName)}?includeFields=true`, {
      method: 'GET',
    });
}

export function fetchCustomObjectDescribeRelatedList({ apiName }) {
  return request(
    `${customObject.replace(':id', apiName)}/related_list`, {
      method: 'GET',
    });
}

export function fetchCustomObjectDetailLayouts(apiName) {
  return request(
    `${customObjectLayout}/list/${apiName}`, {
      method: 'GET',
    });
}

export function fetchCustomObjectDetailLayot({ apiName, layoutType }) {
  return request(
    `${customObjectLayout}/${apiName}/${layoutType}`, {
      method: 'GET',
    });
}

export function editCustomObjectDetailLayout(layout) {
  return request(
    `${customObjectLayout}/${layout.id}`, {
      method: 'PUT',
      body: layout,
    });
}

export function createCustomObjectDetailLayout(layout) {
  return request(
    `${customObjectLayout}/`, {
      method: 'POST',
      body: layout,
    });
}
