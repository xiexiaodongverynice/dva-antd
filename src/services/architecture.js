import { request } from '../utils';

export function upload() {
  return request(
    '/rest/download/territory', {
      method: 'GET',
    });
}
