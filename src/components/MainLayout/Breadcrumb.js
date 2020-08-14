import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'dva/router';
import _ from 'lodash';
import { flattenRoutes } from '../../routerrc';
import styles from './Breadcrumb.less';

const routesDicts = flattenRoutes();

// @hhy: 获取breadcrumbName
const getBreadcrumbName = ({ route, state }) => {
  const { breadcrumbName, getBreadcrumbNameByState } = route;
  if (_.isFunction(getBreadcrumbNameByState) && !_.isNull(state)) {
    return getBreadcrumbNameByState(state);
  } else {
    return breadcrumbName;
  }
};

// @hhy: 由于路由存在看似的parent children 关系，但是因为使用chidlroutes会造成渲染parent路由组件，所以路由大体上都写成了平级关系，所以对breadcrumb需要做额外的处理

function itemRender(props) {
  const { location: { state = {} } } = props;
  return function itemRenderLogistic(route, params, routes, paths) {
    const last = routes.indexOf(route) === routes.length - 1;
    const { parentName } = route;
    const breadcrumbName = getBreadcrumbName({ route, state });
    return (
      last ? <span>{
        (() => {
          if (parentName) {
            const parentRoute = _.find(routesDicts, {
              name: parentName,
            });
            if (parentRoute) {
              // @hhy: getBreadcrumbName({route: parentRoute, state}) 所接收的state是当前locaiton的state， 而不是parent location state, 所以此处需要改进
              return [<Link to={parentRoute.path} key={1}>{getBreadcrumbName({ route: parentRoute, state })}</Link>, <span key={2} className={styles['scoped-ant-breadcrumb-separator']}>:</span>, `${breadcrumbName}`];
            } else {
              return breadcrumbName;
            }
          } else {
            return breadcrumbName;
          }
        })()
      }</span> : <Link to={paths.join('/')}>{
        breadcrumbName
      }</Link>
    );
  };
}

const mainBreadcrumb = (props) => {
  const { routes } = props;
  return (
    <div className={styles.Bread}>
      <span className={styles.BreadLeft}>当前位置</span>
      <Breadcrumb className={styles.BreadLeft} separator=":" routes={routes} itemRender={itemRender(props)} />
    </div>
  );
};

export default mainBreadcrumb;
