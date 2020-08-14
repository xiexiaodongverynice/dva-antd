import lodash from 'lodash';
import config from './config';
import request from './request';
import loginRequest from './login';


function creat_obj(record, objectList, field_value) {
  const field_obj = {};
  const fieldpermission = [];
  let is_obj = {};
  for (let i = 0; i < objectList.length; i++) {
    if (objectList[i].id == record.object_describe_id) {
      is_obj = {
        obj_id: objectList[i].id,
        obj_name: objectList[i].table_name,
        obj_value: 0,
      };
    }
  }
  field_obj.field_name = record.api_name;
  field_obj.field_value = field_value;
  fieldpermission.push(field_obj);
  is_obj.obj_field = JSON.stringify(fieldpermission);

  return is_obj;
}

function edit_obj(record, field_value, obj_text) {
  console.log(record);
  const pending_field = [];

  if (obj_text.obj_field) { // 如果存在,则序列化
    const json = toArray(obj_text.obj_field);
    let add = true;
    for (let i = 0; i < json.length; i++) {
      if (json[i].field_name == record.api_name) {
        add = false;
        json[i].field_value = field_value;
        break;
      }
    }
    if (add) {
      const obj = {
        field_name: record.api_name,
        field_value,
      };
      json.push(obj);
    }
    obj_text.obj_field = json;
  } else { // 如果不存在，则进行构建
    const obj = {
      field_name: record.api_name,
      field_value,
    };
    pending_field.push(obj);
    obj_text.obj_field = pending_field;
    console.log(obj_text);
  }
}

function fieldValue(record, field_value, data_obj, objectList) {
  // 如果存在permisson，则进行修改permisson操作
  if (data_obj.permission != undefined && data_obj.permission != '') {
    const json = toArray(data_obj.permission);// text格式转换jsonb
    let add = true;// 定义是进行对象创建
    for (let i = 0; i < json.length; i++) {
      if (json[i].obj_id == record.object_describe_id) {
        add = false;// 取消对象创建，执行修改
        edit_obj(record, field_value, json[i]);
        break;
      }
    }
    if (add) { // 如果匹配失败，创建对象
      const obj = creat_obj(record, objectList, field_value);
      json.push(obj);
      // data_obj.permission = JSON.stringify(json)
      data_obj.permission = json;
      return data_obj;
    }

    // data_obj.permission = JSON.stringify(json)
    data_obj.permission = json;
    return data_obj;
  } else { // 如果不存在permisson，则进行创建permisson操作
    const obj = creat_obj(record, objectList, field_value);
    const is_array = [];
    is_array.push(obj);
    // data_obj.permission = JSON.stringify(is_array)
    data_obj.permission = is_array;
    return data_obj;
  }
}

/**
 * undefined => []
 * JSON String => parse
 * Array => obj
 * default => []
 * @param obj
 * @returns {*}
 */
const toArray = (obj) => {
  if (obj === undefined) {
    return [];
  }
  if (Array.isArray(obj)) {
    return obj;
  }
  if (typeof obj === 'string' || obj instanceof String) {
    try {
      return JSON.parse(obj);
    } catch (e) {
      return [];
    }
  }
  return [];
};

const object_serialize = (str) => {
  const nodes = [];
  if (str != undefined && str != '') {
    const json = eval(`(${str})`);

    if (json != undefined) {
      for (let i = 0; i < json.length; i++) {
        const key = json[i];

        const numValue = parseInt(key.obj_value, 10);
        switch (numValue) {
          case 2:
            nodes.push(`${key.obj_id}-1-${key.obj_name}`);
            break;
          case 4:
            nodes.push(`${key.obj_id}-2-${key.obj_name}`);
            break;
          case 8:
            nodes.push(`${key.obj_id}-3-${key.obj_name}`);
            break;
          case 16:
            nodes.push(`${key.obj_id}-4-${key.obj_name}`);
            break;
          case 32:
            nodes.push(`${key.obj_id}-5-${key.obj_name}`);
            break;
          case 64:
            nodes.push(`${key.obj_id}-6-${key.obj_name}`);
            break;
          case 128:
            nodes.push(`${key.obj_id}-7-${key.obj_name}`);
            break;
          default :
            if ((numValue & 2) == 2) {
              nodes.push(`${key.obj_id}-1-${key.obj_name}`);
            }
            if ((numValue & 4) == 4) {
              nodes.push(`${key.obj_id}-2-${key.obj_name}`);
            }
            if ((numValue & 8) == 8) {
              nodes.push(`${key.obj_id}-3-${key.obj_name}`);
            }
            if ((numValue & 16) == 16) {
              nodes.push(`${key.obj_id}-4-${key.obj_name}`);
            }
            if ((numValue & 32) == 32) {
              nodes.push(`${key.obj_id}-5-${key.obj_name}`);
            }
            if ((numValue & 64) == 64) {
              nodes.push(`${key.obj_id}-6-${key.obj_name}`);
            }
            if ((numValue & 128) == 128) {
              nodes.push(`${key.obj_id}-7-${key.obj_name}`);
            }
        }
      }
    }
  }
  return nodes;
};

// 去重
const object_expandedKeys = (str) => {
  const strList = [];
  const strObj = [];
  const objList = [];
  if (str) {
    for (let i = 0; i < str.length; i++) {
      const isarr = str[i].split('-');
      if (!isarr[1]) {
        isarr[1] = 0;
      }
      strList.push(isarr[0]);
      const obj = {
        id: isarr[0],
        number: isarr[1],
        name: isarr[2],
      };
      strObj.push(obj);
    }
  }
  const list = new Set(strList);

  for (let i = 0; i < [...list].length; i++) {
    const obj = {
      obj_id: [...list][i],
      obj_name: '',
      obj_value: 0,
      obj_field: '[]',
    };
    for (let x = 0; x < strObj.length; x++) {
      if (([...list][i] == strObj[x].id) && strObj[x].name) {
        obj.obj_name = strObj[x].name;
        obj.obj_value += Math.pow(2, strObj[x].number);
      }
    }
    objList.push(obj);
  }


  const isObj = {
    list: [...list],
    objList,
  };
  return isObj;
};


const permisson_serialize = (checkedKeys, data_obj) => {
  const { objList } = object_expandedKeys(checkedKeys);
  const isBody = [];
  if (data_obj.permission != undefined && data_obj.permission != '' && data_obj.permission != '[]') {
    const json = eval(`(${data_obj.permission})`);
    for (let x = 0; x < json.length; x++) {
      let add = true;
      for (let i = 0; i < objList.length; i++) {
        if (json[x].obj_id == objList[i].obj_id) {
          json[x].obj_value = objList[i].obj_value;
          add = false;
          break;
        }
      }
      if (add) {
        json[x].obj_value = 0;
      }
      isBody.push(json[x]);
    }
    for (let i = 0; i < objList.length; i++) {
      let add = true;
      for (let x = 0; x < json.length; x++) {
        if (objList[i].obj_id == json[x].obj_id) {
          add = false;
          break;
        }
      }
      if (add) {
        isBody.push(objList[i]);
      }
    }
    data_obj.permission = JSON.stringify(isBody);
  } else {
    data_obj.permission = JSON.stringify(objList);
  }

  return data_obj;
};


/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
  const data = lodash.cloneDeep(array);
  const result = [];
  const hash = {};
  const dataIndex = 'kg';
  data.forEach((item, index) => {
    if (data[index][id]) {
      hash[data[index][id]] = data[index];
    } else if (pid) {
      hash[dataIndex + index] = data[index];
    } else {
      hash.first = data[index];
    }
  });

  data.forEach((item) => {
    const hashVP = hash[item[pid]];
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = []);
      hashVP[children].push(item);
    } else {
      result.push(item);
    }
  });
  // console.log(result);
  return result;
};

const durationMinuteTime = (StatusMinute) => {
  if (StatusMinute == null || StatusMinute == undefined) {
    return;
  }
  const day = parseInt(StatusMinute / 60 / 24);
  const hour = parseInt(StatusMinute / 60 % 24);
  const min = parseInt(StatusMinute % 60);
  StatusMinute = '';
  if (day > 0) {
    StatusMinute = `${day}天`;
  }
  if (hour > 0) {
    StatusMinute += `${hour}小时`;
  }
  if (min > 0) {
    StatusMinute += `${parseFloat(min)}分钟`;
  }
  return StatusMinute;
};

module.exports = {
  config,
  fieldValue,
  object_serialize,
  object_expandedKeys,
  permisson_serialize,
  request,
  loginRequest,
  toArray,
  arrayToTree,
  durationMinuteTime,
};
