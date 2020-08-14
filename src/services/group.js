import { config, request } from '../utils';
import { pickValues } from '../utils/custom_util';

const { api } = config;

const { group } = api;

export function fetch(values) {
  return request(`${group}/${values.pageSize}/${values.pageNo}`, {
    method: 'POST',
    body: pickValues(values),
  });
}

export function onegroup(values) {
  return request(`${group}/${values.id}`, {
    method: 'GET',
  });
}

export function DelGroup(values) {
  return request(`${group}/${values.id}`, {
    method: 'DELETE',
  });
}
export function Create(values) {
  return request(`${group}`, {
    method: 'POST',
    body: values,
  });
}

export function Editgroup(values) {
  return request(`${group}/${values.id}`, {
    method: 'PUT',
    body: values,
  });
}
