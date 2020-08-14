import _ from 'lodash';
import { config, request } from '../utils';

const { api } = config;

const { scm } = api;

export const fetchRecentlyCommit = (params) => {
  const { type, id } = params;
  return request(
    `${scm}/${type}/${id}/recently`, {
      method: 'GET',
    });
};

export const fetchRecentlyCommitDiff = (params) => {
  const { type, id } = params;
  return request(
    `${scm}/${type}/${id}/diffRecently`, {
      method: 'GET',
    });
};


/**
 * 保存为新版本
 * @param params
 */
export const newScm = (params) => {
  const { type, id } = params;
  return request(
    `${scm}/${type}/${id}/new`, {
      method: 'POST',
      body: _.chain(params).omit(['id', 'type']).value(),
    });
};

export const fetchCommitList = (params) => {
  const { type, id } = params;
  return request(
    `${scm}/${type}/${id}/list`, {
      method: 'GET',
    });
};

export const showFileByCommit = (params) => {
  const { type, id } = params;
  return request(
    `${scm}/${type}/${id}/show`, {
      method: 'POST',
      body: _.chain(params).omit(['id', 'type']).value(),
    });
};

export const fetchCommitDiff = (params) => {
  const { type, id } = params;
  return request(
    `${scm}/${type}/${id}/diff`, {
      method: 'POST',
      body: _.chain(params).omit(['id', 'type']).value(),
    });
};

export const rollback = (params) => {
  const { type, id } = params;
  return request(
    `${scm}/${type}/${id}/rollback`, {
      method: 'POST',
      body: _.chain(params).omit(['id', 'type']).value(),
    });
};
