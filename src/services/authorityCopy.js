/**
 * Created by shaomch on 2017/5/15.
 */
import request from '../utils/request';

export const fetch = ({ page }) => {
  const url = 'http://127.0.0.1:8090/getAuthority';
  return (request(url, { method: 'POST', body: JSON.stringify(page) }));
};
