import fetch from 'dva/fetch';
import { message } from 'antd';
import { hashHistory } from 'dva/router';
import _ from 'lodash';
import { baseURL, FS, DATA_EXPORT_BASE } from './config';


function checkStatus(response) {
  const { status, statusText } = response;
  if (status >= 200 && status < 300) {
    return response;
  }
  const error = new Error(statusText);
  error.response = response;
  throw error;
}


/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

// TODO 请求发生错误不应该只返回{data: false}
export default async function request(url, options = {
  method: 'GET',
}) {
  /**
   * 过滤掉第三方服务
   */
  if(!_.startsWith(url, FS) && !_.startsWith(url, DATA_EXPORT_BASE)) {
    url = typeof url == "string" && url.startsWith("http") ? url : (baseURL + url);
  }
  options.headers = {
    token: options.token ? options.token : localStorage.getItem('token'),
  };
  const { method } = options;
  if (method === 'POST' || method === 'PUT') {
    options.body = JSON.stringify({
      body: options.body,
    });
  }

  const response = await fetch(url, options).then(checkStatus);
  const body = await response.json();
  const { head, result } = body;

  if (head) {
    const { code, token, msg } = head;
    if (code === 200) {
      // localStorage.setItem('token', token);
      if (result) {
        for (let i = 0; i < result.length; i++) {
          result[i].id = `${result[i].id}`;
        }
      }
      return {
        data: {
          data: body,
        },
      };
    } else if (code === 401) {
      message.error('用户登录信息过期或未登录，请重新登录！');
      hashHistory.push('/login');
      return { data: false };
    } else if (code === 400 || code === 500) {
      message.error(msg);
      return { data: false };
    } else {
      message.error('与服务器通讯失败，请刷新页面或联系管理员');
      return { data: false };
    }
  } else {
    message.error('与服务器通讯失败，请刷新页面或联系管理员');
    return { data: false };
  }
}

