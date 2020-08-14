import request from '../utils/login';
import { ssoURL } from '../utils/config';

const userAgent = window.navigator.userAgent,
  rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
  rFirefox = /(firefox)\/([\w.]+)/,
  rOpera = /(opera).+version\/([\w.]+)/,
  rChrome = /(chrome)\/([\w.]+)/,
  rSafari = /version\/([\w.]+).*(safari)/;
function uaMatch(ua) {
  let match = rMsie.exec(ua);
  if (match != null) {
    return { browser: 'IE', version: match[2] || '0' };
  }
  match = rFirefox.exec(ua);
  if (match != null) {
    return { browser: match[1] || '', version: match[2] || '0' };
  }
  match = rOpera.exec(ua);
  if (match != null) {
    return { browser: match[1] || '', version: match[2] || '0' };
  }
  match = rChrome.exec(ua);
  if (match != null) {
    return { browser: match[1] || '', version: match[2] || '0' };
  }
  match = rSafari.exec(ua);
  if (match != null) {
    return { browser: match[2] || '', version: match[1] || '0' };
  }
  if (match != null) {
    return { browser: '', version: '0' };
  }
}


export function login(values) {
  const browserMatch = uaMatch(userAgent.toLowerCase());
  const URl = values.loginServer ? `${values.loginServer}/login` : ssoURL;
  const body = values.loginServer ? {
    deviceType: 'sync',
    browserType: browserMatch.browser,
    browserVersion: browserMatch.version,
    loginName: values.loginName,
    busType: 'tenant',
    pwd: values.password,
  } : {
    deviceType: 'PC',
    busType: 'tenant',
    browserType: browserMatch.browser,
    browserVersion: browserMatch.version,
    ...values,
  };
  return request(URl, {
    method: 'POST',
    body,
  });
}

