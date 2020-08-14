// noinspection JSAnnotator
/**
 * route parentName 用以关联路由parent
 */
import React from 'react';
import { Router } from 'dva/router';
import { craftRoutes, registerModel } from './routerrc';

function RouterConfig({ history, app }) {
  return (<Router
    history={history} routes={craftRoutes({
      registerModel: registerModel(app),
    })}
  />);
}

export default RouterConfig;

