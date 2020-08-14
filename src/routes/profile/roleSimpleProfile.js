import React from 'react';
import { connect } from 'dva';
import RoleSimpleProfile from '../../components/profile/roleSimpleProfile';

const RoleProfile = ({ dispatch,
                       objectList,
                       profileData,
                       objectFieldList,
                       permissonStr,
                       permissonSelect,
                       fields,
                       nodes,
                       loading, viewType }) => {
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 225 }}>
      <RoleSimpleProfile
        dispatch={dispatch}
        objectList={objectList}
        objectFieldList={objectFieldList}
        profileData={profileData}
        permissonStr={permissonStr}
        permissonSelect={permissonSelect}
        fields={fields}
        nodes={nodes}
        loading={loading}
        viewType={viewType}


      />
    </div>
  );
};

function mapStateToProps(state) {
  const { objectList } = state.roleProfile;
  const { objectFieldList } = state.roleProfile;
  const { profileData } = state.roleProfile;
  const { permissonStr } = state.roleProfile;
  const { permissonSelect } = state.roleProfile;
  const { fields } = state.roleProfile;
  const { nodes } = state.roleProfile;
  const { viewType } = state.roleProfile;
  return {
    objectList, objectFieldList, profileData, permissonStr, permissonSelect, fields, nodes, loading: state.loading.models.roleProfile, viewType,
  };
}
export default connect(mapStateToProps)(RoleProfile);

