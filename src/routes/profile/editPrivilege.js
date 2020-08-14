import React from 'react';
import { connect } from 'dva';
import PrivilegeEditor from '../../components/profile/privilegeEditor';

class ProfilePrivilegeEditor extends React.Component {
  onSave({ id, version, permission, selected_options, app_authorize }) {
    this.props.dispatch({
      type: 'profile_privilege/updatePermission',
      payload: {
        id,
        version,
        permission,
        selected_options,
        app_authorize,
      },
    });
  }
  render() {
    return <PrivilegeEditor {...this.props} onSave={this.onSave} />;
  }
}

function mapStateToProps(state) {
  const { id, permission, version, name, selected_options, app_authorize } = state.profile_privilege;
  return {
    id,
    permission,
    version,
    name,
    selected_options,
    app_authorize,
  };
}

export default connect(mapStateToProps)(ProfilePrivilegeEditor);
