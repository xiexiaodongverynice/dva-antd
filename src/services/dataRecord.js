/**
 * Created by xinli on 13/06/2017.
 */

import { config, request } from '../utils';

const { api } = config;

const { tab } = api;

export function fetch() {
  return request(
    `${tab}/`, {
      method: 'GET',
    });
}

export function deleteTab(values) {
  return request(
    `${tab}/${values.id}`, {
      method: 'DELETE',
      body: values,
    });
}
export function fetchTab(id) {
  return request(
    `${tab}/${id}`, {
      method: 'GET',
    });
}
export function create(values) {
  return request(
    `${tab}/`, {
      method: 'POST',
      body: values,
    });
}

export function updateTab(value) {
  return request(
    `${tab}/${value.id}`, {
      method: 'PUT',
      body: value,
    });
}
