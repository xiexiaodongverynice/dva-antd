import { config, request } from '../utils';
import { pickValues } from '../utils/custom_util';

const { api } = config;

const { role, query } = api;

export function fetch(values) {
  return request(
    `${role}/${values.pageSize}/${values.pageNo}`, {
      method: 'POST',
      body: pickValues(values),
    });
}
export function fetchAll() {
  return request(
    `${role}`, {
      method: 'GET',
    });
}
export function roleUser(id) {
  return request(
    `${query}role/rol_id/${id}`, {
      method: 'GET',
    });
}

export function oneRole(values) {
  return request(
    `${role}/${values.id}`, {
      method: 'GET',
    });
}
export function delRole(values) {
  return request(
    `${role}/${values.id}`, {
      method: 'DELETE',
    });
}
export function create(values) {
  return request(
    `${role}`, {
      method: 'POST',
      body: values,

    });
}
export function Edit(values) {
  return request(
    `${role}/${values.id}`, {
      method: 'PUT',
      body: values,
    });
}

