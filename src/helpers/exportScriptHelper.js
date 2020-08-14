import _ from 'lodash';

export const getNS = (mode) => {
  let ns;
  switch(mode){
    case 'new':
      ns = 'data_export_script_new';
      break;
    case 'edit':
      ns = 'data_export_script_edit';
      break;
    case 'copy':
      ns = 'data_export_script_copy';
      break;
    default:
      ns ='data_export_script_new';
      break;
  }
  return ns;
};
