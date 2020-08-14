import React from 'react';
import { connect } from 'dva';
import PrivilegeEditor from '../../components/profile/privilegeEditor';
/**
 * 设置权限组的权限，使用'Group'是遵循之前的命名，实际是PermissionSet
 */
class GroupPrivilegeEditor extends React.Component {
  onSave = ({ id, permission, version, app_authorize }) => {
    this.props.dispatch({
      type: 'group_privilege/updatePermission',
      payload: {
        id,
        version,
        permission,
        app_authorize,
      },
    });
  };

  render() {
    return <PrivilegeEditor {...this.props} onSave={this.onSave} />;
  }
}

function mapStateToProps(state) {
  const { id, permission, version, app_authorize } = state.group_privilege;
  return {
    id,
    permission,
    version,
    app_authorize,
  };
}

export default connect(mapStateToProps)(GroupPrivilegeEditor);
