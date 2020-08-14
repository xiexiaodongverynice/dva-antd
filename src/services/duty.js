import { config, request } from '../utils';
import { pickValues } from '../utils/custom_util';

const { api } = config;

const { duty } = api;

export function fetch(values) {
  return request(
    `${duty}/${values.pageSize}/${values.pageNo}`, {
      method: 'POST',
      body: pickValues(values),
    });
}
export function oneduty(values) {
  return request(
    `${duty}/${values.id}`, {
      method: 'GET',
    });
}
export function delduty(values) {
  return request(
    `${duty}/${values.id}`, {
      method: 'DELETE',
    });
}
export function create(values) {
  return request(
    `${duty}`, {
      method: 'POST',
      body: values,

    });
}
export function Edit(values) {
  return request(
    `${duty}/${values.id}`, {
      method: 'PUT',
      body: values,
    });
}

