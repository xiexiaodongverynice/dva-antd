/**
 * Created by xinli on 25/07/2017.
 */
const USER_PERMISSION = 'userPermission';
export const setPermission = (permission) => {
  localStorage.setItem(USER_PERMISSION, JSON.stringify(permission));
};

export const getPermission = () => {
  const localPermissionJson = localStorage.getItem(USER_PERMISSION);
  if (localPermissionJson) {
    return JSON.parse(localPermissionJson);
  } else {
    return {};
  }
};

export const hasObjectFunction = (apiName, functionCode) => {
  if (!functionCode) {
    return false;
  }
  const permission = getPermission();
  const objGrantedCode = permission[`obj.${apiName}`];
  if (objGrantedCode) {
    return (functionCode & objGrantedCode) === functionCode;
  } else {
    return false;
  }
};

export const hasFieldFunction = (objectApiName, fieldApiName, functionCode) => {
  const permission = getPermission();
  const fieldGrantedCode = permission[`field.${objectApiName}.${fieldApiName}`];
  if (fieldGrantedCode) {
    return (functionCode & fieldGrantedCode) === functionCode;
  } else {
    return false;
  }
};
