import axios from 'axios';
import qs from 'qs';
import jsonp from 'jsonp';
import _ from 'lodash';
import pathToRegexp from 'path-to-regexp';
import { message } from 'antd';
import { hashHistory } from 'dva/router';
import { YQL, CORS, baseURL } from './config';

axios.defaults.baseURL = baseURL;
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';

const header = {
  'content-type': 'application/json;charset=UTF-8',
};

const fetch = (options) => {
  let {
    data,
    url,
  } = options;
  const {
    method = 'get',
    fetchType,
  } = options;

  const cloneData = _.cloneDeep(data);

  try {
    let domin = '';
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      domin = url.match(/[a-zA-z]+:\/\/[^/]*/)[0];
      url = url.slice(domin.length);
    }
    const match = pathToRegexp.parse(url);
    url = pathToRegexp.compile(url)(data);
    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name];
      }
    }
    url = domin + url;
  } catch (e) {
    message.error(e.message);
  }

  if (fetchType === 'JSONP') {
    return new Promise((resolve, reject) => {
      jsonp(url, {
        param: `${qs.stringify(data)}&callback`,
        name: `jsonp_${new Date().getTime()}`,
        timeout: 4000,
      }, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve({ statusText: 'OK', status: 200, data: result });
      });
    });
  } else if (fetchType === 'YQL') {
    url = `http://query.yahooapis.com/v1/public/yql?q=select * from json where url='${options.url}?${qs.stringify(options.data)}'&format=json`;
    data = null;
  }

  const value = {};
  value.head = { token: localStorage.getItem('token') };
  value.body = cloneData;
  const bodyData = JSON.stringify(value);
  const cloneData1 = _.defaults(cloneData, value.head);
  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData1,
      }, { headers: header });
    case 'delete':
      url = `${url}?token=${value.head.token}`;
      return axios.delete(url, {
        data: cloneData1,
      }, { headers: header });
    case 'post':
      // cloneData = _.cloneDeep(bodyData);
      return axios.post(url, bodyData, { headers: header });
    case 'put':
      return axios.put(url, bodyData, { headers: header });
    case 'patch':
      return axios.patch(url, bodyData, { headers: header });
    default:
      return axios(options, { headers: header });
  }
};

export default function request(options) {
  if (options.url && options.url.indexOf('//') > -1) {
    const origin = `${options.url.split('//')[0]}//${options.url.split('//')[1].split('/')[0]}`;
    if (window.location.origin !== origin) {
      if (CORS && CORS.indexOf(origin) > -1) {
        _.set(options, 'fetchType', 'CORS');
      } else if (YQL && YQL.indexOf(origin) > -1) {
        _.set(options, 'fetchType', 'YQL');
      } else {
        _.set(options, 'fetchType', 'JSONP');
      }
    }
  }

  return fetch(options).then((response) => {
    const statusText = response.data.head.msg;
    console.log(`fetch request：${statusText}`);
    // const { statusText, status } = response
    const data = options.fetchType === 'YQL' ? response.data.query.results.json : response.data.body.items || response.data.body;
    // let size=response.data.body.size;
    const ret = {
      data,
      headers: {},
    };
    // if (response.headers.get('x-total-count')) {
    if (response.data.body.size !== null) {
      ret.headers['x-total-count'] = response.data.body.size;// response.headers.get('x-total-count');
    }

    if (response.data) {
      if (response.data.head.code === 200) {
        console.log('request success.');
      } else if (response.data.head.code === 401) {
        message.error('用户登录信息过期或未登录，请重新登录！', 3);
        hashHistory.push('/login');
      } else if (response.data.head.code === 400 || response.data.head.code === 500) {
        message.error(response.data.head.msg);
        return { data: false };
      } else {
        message.error('与服务器通讯失败，请刷新页面或联系管理员');
      }
    }

    return ret;
  }).catch((error) => {
    const data = { error };
    console.error(error);
    const ret = {
      data,
      headers: {},
    };
    ret.headers['x-total-count'] = 0;
    return ret;
   // const { response } = error
   //  let msg
   //  let status
   //  let otherData = {}
   //  if (response) {
   //    const { data, statusText } = response
   //    otherData = data
   //    status = response.status
   //    msg = data.message || statusText
   //  } else {
   //    status = 600
   //    msg = 'Network Error'
   //  }
   //  return { success: false, status, message: msg, ...otherData }
  });
}
