import React from 'react';
import { connect } from 'dva';
import Home from '../../components/home/home';

const HomePage = ({ dispatch, body }) => {
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 525 }}>
      <Home body={body} dispatch={dispatch} />
    </div>
  );
};

function mapStateToProps(state) {
  const { body } = state.home;
  return { body };
}
export default connect(mapStateToProps)(HomePage);
