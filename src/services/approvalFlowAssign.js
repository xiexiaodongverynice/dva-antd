import { config, request } from '../utils';

const { api } = config;

const { approval_flow_assign } = api;

// 获取列表
export function fetch(payload) {
  return request(
    `${approval_flow_assign}/${payload.approvalFlowApiName}`, {
      method: 'GET',
    });
}
// 根据id 获取
// export function fetchById(id) {
//   return request(
//     `${approval_flow}/${id}`, {
//       method: 'GET',
//     });
// }
// 新增
export function assign(values) {
  return request(
    `${approval_flow_assign}/${values.approval_flow_api_name}`, {
      method: 'POST',
      body: values.data,
    });
}

