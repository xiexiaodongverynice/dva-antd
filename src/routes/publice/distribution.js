import React from 'react';
import { connect } from 'dva';
import Transfer from '../../components/public/transfer';


const Distribution = ({ role, mockData, oldTargetKeys, dispatch, targetBodyObj, targetKeys, config, location, loading }) => {
  function searchChange(value) {
    dispatch({ type: 'roleTransfer/fetchUser', payload: { id: value, config } });
  }

  function saveDistribution(body, config, oldBody, oldTargetKeys, targetBodyObj) {
    if (location.pathname == '/group/distribution') {
      dispatch({
        type: 'roleTransfer/DistributionGroup',
        payload: { body, config, old: oldBody, oldTargetKeys, targetBodyObj },
      });
    } else {
      dispatch({
        type: 'roleTransfer/Distribution',
        payload: { body, config, old: oldBody, oldTargetKeys, targetBodyObj },
      });
    }
  }

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 525 }}>
      <Transfer
        onSearch={searchChange}
        onSave={saveDistribution}
        searchList={role}
        mockData={mockData}
        dispatch={dispatch}
        targetKeys={targetKeys}
        config={config}
        location={location}
        oldTargetKeys={oldTargetKeys}
        targetBodyObj={targetBodyObj}
        loading={loading}
      />
    </div>
  );
};

function mapStateToProps(state) {
  const { role, mockData, targetKeys, oldTargetKeys, targetBodyObj, config } = state.roleTransfer;
  return {
    loading: state.loading.models.roleTransfer,
    role,
    mockData,
    targetKeys,
    oldTargetKeys,
    targetBodyObj,
    config,
  };
}

export default connect(mapStateToProps)(Distribution);

