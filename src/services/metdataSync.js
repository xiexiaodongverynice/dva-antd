import { config, request as request_medata } from '../utils';

const { api } = config;
const { metadata_baseUrl, custom_objects_page, custom_object_layout, profile_data, kpiDef, sequence, translation, action_script, trigger_page, tab, tenant_setting, function_permission, approval_flow, layout_assign } = api;
//同步按钮接口
export function sync(values) {
  return request_medata(
    `${metadata_baseUrl}/sync/v2/`, {
      method: 'POST',
      body: values,
    });
}
//获取对应tab页数据接口
export function objectAllList(params) {
  let token = params.token, url = params.url,  options = {
    method: 'get',
  };
  if (params && token) options["token"] = token;
  return request_medata(
    `${url ? url :  " "}${custom_objects_page}/99999999/1`, options);
}
export function object_layout(params) {
  let token = params.token, url = params.url, options= {
    method: 'get',
  };
  if(params && token) options["token"] = token;
  return request_medata(
    `${url ? url : ""}${custom_object_layout}/list/all`,options);
}
export function object_profile(params) {
  let token = params.token, url = params.url, options= {
    method: 'get',
  };
  if(params && token) options["token"] = token;
  return request_medata(
    `${url ? url : ""}${profile_data}`,options);
}
export function object_kpiDef(params) {
  let token = params.token, url = params.url, options= {
    method: 'get',
  };
  if(params && token) options["token"] = token;
  return request_medata(
    `${url ? url : ""}${kpiDef}/list/all`,options);
}
export function object_sequence(params) {
  let token = params.token, url = params.url, options= {
    method: 'get',
  };
  if(params && token) options["token"] = token;
  return request_medata(
    `${url ? url : ""}${sequence}/`,options);
}
export function object_translation(params) {
  let token = params.token, url = params.url, options= {
    method: 'get',
  };
  if(params && token) options["token"] = token;
  return request_medata(
    `${url ? url : ""}${translation}/all`,options);
}
export function object_action_script(params) {
  let token = params.token, url = params.url, options= {
    method: 'get',
  };
  if(params && token) options["token"] = token;
  return request_medata(
    `${url ? url : ""}${action_script}/`,options);
}
export function object_trigger_page(params) {
  let token = params.token, url = params.url, options= {
    method: 'get',
  };
  if(params && token) options["token"] = token;
  return request_medata(
    `${url ? url : ""}${trigger_page}/9999/1`,options);
}
export function object_tab(params) {
  let token = params.token, url = params.url, options= {
    method: 'get',
  };
  if(params && token) options["token"] = token;
  return request_medata(
    `${url ? url : ""}${tab}/`,options);
}
export function object_tenant_setting(params) {
  let token = params.token, url = params.url, options= {
    method: 'get',
  };
  if(params && token) options["token"] = token;
  return request_medata(
    `${url ? url : ""}${tenant_setting}/list/all`,options);
}
export function object_function_permission(params) {
  let token = params.token, url = params.url, options= {
    method: 'get',
  };
  if(params && token) options["token"] = token;
  return request_medata(
    `${url ? url : ""}${function_permission}/`,options);
}
export function object_approval_flow(params) {
  let token = params.token, url = params.url, options= {
    method: 'get',
  };
  if(params && token) options["token"] = token;
  return request_medata(
    `${url ? url : ""}${approval_flow}/`,options);
}
export function object_layout_assign(params) {
  let token = params.token, url = params.url, options= {
    method: 'get',
  };
  if(params && token) options["token"] = token;
  return request_medata(
    `${url ? url : ""}${layout_assign}/list/all`,options);
}
