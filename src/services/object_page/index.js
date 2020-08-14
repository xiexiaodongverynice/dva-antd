import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;


const { custom_object, layout_by_object_layoutType } = api;


export function fetch(payload) {
  // console.log(layout)
  const url = layout_by_object_layoutType.replace('{objectApiName}', payload.object_api_name).replace('{layoutType}', payload.layout_type);
  // console.log(url);
  return request(url
    , {
      method: 'GET',
    });
}
export function loadObject(payload) {
  const url = `${custom_object.replace(':id', payload.object_api_name)}?includeFields=false`;
  return request(url
    , {
      method: 'GET',
    });
}

