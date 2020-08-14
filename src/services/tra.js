import { config, request } from '../utils';

const { api } = config;

const { sub_baseUrl, user_data, query, allocation } = api;


export function fetchAll(values) {
  return request(
    `${sub_baseUrl}/${values.api_name}`, {
      method: 'GET',
    });
}

export function isUser(values) {
  let url = '';
  if (values.id == '') {
    url = `${user_data}`;
  } else {
    url = `${query}user_info/${values.config.fieldName}/${values.id}`;
  }
  return request(
    url, {
      method: 'GET',
    });
}

export function groupUser(values) {
  return request(
    `/rest/field_query/user_permission_set/${values.id}`, {
      method: 'GET',
    });
}

export function Allocation(values) {
  return request(
    `${allocation}${values.api_name}/${values.id}`, {
      method: 'GET',
    },
  );
}

export function saveDistribution(newbody) {
  return request(
    '/rest/data_record/ubatch/user_info', {
      method: 'PUT',
      body: {
        data: newbody,
      },
    },
  );
}

export function saveDistributionGroup(newbody) {
  return request(
    '/rest/field_query/user_permission_set', {
      method: 'PUT',
      body: newbody,
    },
  );
}
