import request from '../utils/logout';
import { logoutURL } from '../utils/config';

export function gologout(values) {
  const body = {
    token: values,
  };
  return request(logoutURL, {
    method: 'POST',
    body,
  });
}
