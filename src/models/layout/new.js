import { routerRedux } from 'dva/router';
import * as layoutService from '../../services/layout';
import * as objectService from '../../services/customObjects';
import mixinModels from '../../libs/mixinModels';
import * as baseModel from '../base';
import * as createEffect from './createEffect';

export default mixinModels(baseModel, createEffect, {
  namespace: 'newLayout',
  state: {
    layout: {
      object_describe_api_name: '',
      layout_type: '',
      display_name: '',
      layout: 'one_column',
      api_name: '',
    },
    loading: false,
    messages: [],
  },
});
