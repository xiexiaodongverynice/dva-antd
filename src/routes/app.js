import React from 'react';
import { connect } from 'dva';
import MainLayout from '../components/MainLayout/Layout';

const IndexPage = ({ location, routes, children }) => {
  if ((['/login'] && ['/login'].indexOf(location.pathname) > -1)) {
    return <div>{children}</div>;
  }
  return (

    <MainLayout location={location} routes={routes} >
      {children}
    </MainLayout>
  );
};
IndexPage.propTypes = {};
export default connect()(IndexPage);
