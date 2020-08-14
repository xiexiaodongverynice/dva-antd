import modelExtend from 'dva-model-extend';
import _ from 'lodash';

const mixinModels = (...models) => {
  return _.chain(models).flattenDeep().reduce((result, model) => {
    return modelExtend(result, model);
  }, {}).value();
};

export default mixinModels;
