import React from 'react';
import { connect } from 'dva';
import SimpleProfile from '../../components/group/group';

const group = ({ dispatch, objectList, data_obj, objectFieldList, location, expandedKeys, autoExpandParent, checkedKeys, query, loading }) => {
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 225 }}>
      <SimpleProfile
        dispatch={dispatch}
        location={location}
        objectList={objectList}
        objectFieldList={objectFieldList}
        data_obj={data_obj}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        checkedKeys={checkedKeys}
        query={query}
        loading={loading}
      />

    </div>
  );
};

function mapStateToProps(state) {
  const { objectList, objectFieldList, data_obj, expandedKeys, autoExpandParent, checkedKeys, query } = state.group_add;
  return {
    loading: state.loading.models.group_add,
    objectList,
    objectFieldList,
    data_obj,
    expandedKeys,
    autoExpandParent,
    checkedKeys,
    query,
  };
}
export default connect(mapStateToProps)(group);

