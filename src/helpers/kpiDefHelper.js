import _ from 'lodash';

export const getNS = (mode) => {
  let ns;
  switch(mode){
    case 'new':
      ns = 'kpi_def_new';
      break;
    case 'edit':
      ns = 'kpi_def_update';
      break;
    case 'copy':
      ns = 'kpi_def_copy';
      break;
    default:
      ns ='kpi_def_new';
      break;
  }
  return ns;
};

export const kpiTypeDicts = [{
  value: 0,
  text: '达成/目标',
}, {
  value: 1,
  text: '达成',
}];

export const getKpiTypeByValue = (value) => {
  return _.chain(kpiTypeDicts).find({ value }).get('text').value();
};
