import { config, request } from '../utils';
import { pickValues } from '../utils/custom_util';

const { api } = config;

const { department } = api;

export function fetch(values) {
  return request(
    `${department}/${values.pageSize}/${values.pageNo}`, {
      method: 'POST',
      body: pickValues(values),
    });
}
export function onedepartment(values) {
  return request(
    `${department}/${values.id}`, {
      method: 'GET',
    });
}
export function deldepartment(values) {
  return request(
    `${department}/${values.id}`, {
      method: 'DELETE',
    });
}
export function create(values) {
  return request(
    `${department}`, {
      method: 'POST',
      body: values,

    });
}
export function Edit(values) {
  return request(
    `${department}/${values.id}`, {
      method: 'PUT',
      body: values,
    });
}

