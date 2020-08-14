import _ from 'lodash';

const cached = {};
export const registerModel = (app) => {
  return (model) => {
    try {
      if (!cached[model.namespace]) {
        app.model(model);
        cached[model.namespace] = 1;
      }
    } catch (e) {
      console.error('namespace is error!!');
      window.location.reload();
    }
  };
};

export const craftRoutes = ({ registerModel = () => {} } = {}) => {
  return [
    {
      path: '/',
      name: 'IndexPage',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          registerModel(require('./models/app'));
          cb(null, require('./routes/app'));
        });
      },
      childRoutes: [
        {
          path: '/login',
          name: 'LoginPage',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/login'));
              cb(null, require('./routes/login/login'));
            });
          },
        },
        {
          path: '/home',
          name: 'home',
          breadcrumbName: '首页',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/home'));
              cb(null, require('./routes/home/home'));
            });
          },
        },
        {
          path: '/user',
          name: 'user',
          breadcrumbName: '用户管理',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/userList'));
              cb(null, require('./routes/user/userList'));
            });
          },
        },
        {
          path: '/user/register',
          name: 'register',
          breadcrumbName: '新用户',
          parentName: 'user',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 新用户` : '新用户';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/userRegister'));
              cb(null, require('./routes/user/userRegister'));
            });
          },
        },
        {
          path: '/user/detail',
          name: 'detail',
          breadcrumbName: '用户详细',
          parentName: 'user',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 用户详细` : '用户详细';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/userDetail'));
              cb(null, require('./routes/user/userDetail'));
            });
          },
        },
        {
          path: '/profile',
          name: 'profile',
          breadcrumbName: '简档管理',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/simpleProfile'));
              cb(null, require('./routes/profile/simpleProfile'));
            });
          },
        },
        {
          path: '/profile/editProfile',
          name: 'editProfile',
          breadcrumbName: '新建简档',
          parentName: 'profile',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/editSimpleProfile'));
              cb(null, require('./routes/profile/editSimpleProfile'));
            });
          },
        },
        {
          path: '/profile/roleProfile',
          name: 'roleProfile',
          breadcrumbName: '编辑简档',
          parentName: 'profile',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 编辑简档` : '编辑简档';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/roleSimpleProfile'));
              cb(null, require('./routes/profile/roleSimpleProfile'));
            });
          },
        },
        {
          path: '/profile/privileges',
          name: 'profilePrivileges',
          breadcrumbName: '设置权限',
          parentName: 'profile',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 设置权限` : '设置权限';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/profilePrivilege'));
              cb(null, require('./routes/profile/editPrivilege'));
            });
          },
        },
        {
          path: 'profile/distribution',
          name: 'Distribution',
          breadcrumbName: '简档分配',
          parentName: 'profile',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 简档分配` : '简档分配';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/public/transfer'));
              cb(null, require('./routes/publice/distribution'));
            });
          },
        },
        {
          path: '/group/privileges',
          name: 'groupPrivileges',
          breadcrumbName: '设置权限',
          parentName: 'group',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 设置权限` : '设置权限';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/groupPrivilege'));
              cb(null, require('./routes/group/editPrivilege'));
            });
          },
        },
        {
          path: '/role',
          name: 'role',
          breadcrumbName: '角色管理',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/role'));
              cb(null, require('./routes/role/list'));
            });
          },
        },
        {
          path: '/role/add',
          name: 'roleAdd',
          breadcrumbName: '角色添加',
          parentName: 'role',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/role'));
              cb(null, require('./routes/role/add'));
            });
          },
        },
        {
          path: '/role/edit',
          name: 'roleEdit',
          breadcrumbName: '角色修改',
          parentName: 'role',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 角色修改` : '角色修改';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/role'));
              cb(null, require('./routes/role/edit'));
            });
          },
        },
        {
          path: 'role/distribution',
          name: 'Distribution',
          breadcrumbName: '角色分配',
          parentName: 'role',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 角色分配` : '角色分配';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/public/transfer'));
              cb(null, require('./routes/publice/distribution'));
            });
          },
        },
        {
          path: 'role/detail',
          name: 'Distribution',
          breadcrumbName: '角色详情',
          parentName: 'role',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 角色详情` : '角色详情';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/role'));
              cb(null, require('./routes/role/detail'));
            });
          },
        },
        {
          path: '/group',
          name: 'group',
          breadcrumbName: '权限组管理',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/group'));
              cb(null, require('./routes/group/list'));
            });
          },
        },
        {
          path: '/group/add',
          name: 'groupAdd',
          breadcrumbName: '权限组添加',
          parentName: 'group',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/group'));
              cb(null, require('./routes/group/add'));
            });
          },
        },
        {
          path: 'group/distribution',
          name: 'Distribution',
          breadcrumbName: '权限组分配',
          parentName: 'group',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 权限组分配` : '权限组分配';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/public/transfer'));
              cb(null, require('./routes/publice/distribution'));
            });
          },
        },
        {
          path: 'group/group_add',
          name: 'group_add',
          breadcrumbName: '权限组权限设置',
          parentName: 'group',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 权限组权限设置` : '权限组权限设置';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/public/group'));
              cb(null, require('./routes/group/group'));
            });
          },
        },
        {
          path: 'group/group_see',
          name: 'group_see',
          breadcrumbName: '权限组权限详情',
          parentName: 'group',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 权限组权限设置` : '权限组权限详情';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/public/group'));
              cb(null, require('./routes/group/group'));
            });
          },
        },
        {
          path: 'group/copy',
          name: 'copy',
          breadcrumbName: '权限组复制',
          parentName: 'group',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 权限组复制` : '权限组复制';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/group'));
              cb(null, require('./routes/group/copy'));
            });
          },
        },
        {
          path: '/customObjects',
          name: 'customObjectsPage',
          breadcrumbName: '对象与字段',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/customObjects'));
              cb(null, require('./routes/objects/customObjects'));
            });
          },
        },
        {
          path: '/customObjects/:id/fields',
          name: 'customFieldsPage',
          parentName: 'customObjectsPage',
          breadcrumbName: '操作',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 操作` : '操作';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/customFields'));
              cb(null, require('./routes/objects/customFields'));
            });
          },
        },
        {
          path: '/customObjects/:api_name/actions',
          name: 'customActionPage',
          parentName: 'customObjectsPage',
          breadcrumbName: 'Action',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> Action` : 'Action';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/customActions'));
              cb(null, require('./routes/objects/customActions'));
            });
          },
        },
        {
          path: '/layouts/list',
          name: 'layoutListPage',
          breadcrumbName: '布局',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/layout/list'));
              cb(null, require('./routes/layout/list'));
            });
          },
        },
        {
          path: '/layouts/new',
          name: 'newlayoutPage',
          breadcrumbName: '新建布局',
          parentName: 'layoutListPage',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/layout/new'));
              cb(null, require('./routes/layout/newLayout'));
            });
          },
        },
        {
          path: '/layouts/edit',
          name: 'layoutEditPage',
          breadcrumbName: '编辑布局',
          parentName: 'layoutListPage',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 编辑布局` : '编辑布局';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/layout/edit'));
              cb(null, require('./routes/layout/editLayout'));
            });
          },
        },
        {
          path: '/layouts/copy',
          name: 'layoutCopyPage',
          breadcrumbName: '布局复制',
          parentName: 'layoutListPage',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 布局复制` : '布局复制';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/layout/copy'));
              cb(null, require('./routes/layout/copyLayout'));
            });
          },
        },
        {
          path: '/layouts/scm',
          name: 'layoutScmPage',
          breadcrumbName: '新建版本',
          parentName: 'layoutListPage',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 新建版本` : '新建版本';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/layout/scm'));
              cb(null, require('./routes/layout/scmLayout'));
            });
          },
        },
        {
          path: '/layouts/history',
          name: 'layoutHistoryPage',
          breadcrumbName: '历史版本',
          parentName: 'layoutListPage',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 历史版本` : '历史版本';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/layout/history'));
              cb(null, require('./routes/layout/historyLayout'));
            });
          },
        },
        {
          path: '/approval_flow/index',
          name: 'approvalFlowIndex',
          breadcrumbName: '审批流',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/approvalFlow'));
              cb(null, require('./routes/approval_flow/list'));
            });
          },
        },
        {
          path: 'approval_flow/add',
          name: 'approvalFlowAddPage',
          breadcrumbName: '新建审批流',
          parentName: 'approvalFlowIndex',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 新建` : '新建';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/approvalFlow'));
              cb(null, require('./routes/approval_flow/add'));
            });
          },
        },
        {
          path: '/approval_flow/edit',
          name: 'approvalFlowEditPage',
          breadcrumbName: '编辑',
          parentName: 'approvalFlowIndex',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 编辑` : '编辑';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/approvalFlow'));
              cb(null, require('./routes/approval_flow/edit'));
            });
          },
        },
        {
          path: '/layout_assign/edit',
          name: 'layoutAssignEditPage',
          breadcrumbName: '编辑',
          parentName: 'layoutAssignListPage',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 编辑` : '编辑';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/layoutassign/edit'));
              cb(null, require('./routes/layoutassign/editLayoutAssign'));
            });
          },
        },
        {
          path: '/layout_assign/add',
          name: 'layoutAssignAddPage',
          breadcrumbName: '新建',
          parentName: 'layoutAssignListPage',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/layoutassign/edit'));
              cb(null, require('./routes/layoutassign/newLayoutAssign'));
            });
          },
        },
        {
          path: '/layout_assign/list',
          name: 'layoutAssignListPage',
          breadcrumbName: '布局分配',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/layoutassign/list'));
              cb(null, require('./routes/layoutassign/list'));
            });
          },
        },
        {
          path: '/kpi_def/list',
          name: 'KPIDefListPage',
          breadcrumbName: 'KPI',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/kpidef/list'));
              cb(null, require('./routes/kpidef/list'));
            });
          },
        },
        {
          path: '/kpi_def/new',
          name: 'newKPIPage',
          breadcrumbName: '新建KPI',
          parentName: 'KPIDefListPage',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 新建KPI` : '新建KPI';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/kpidef/new'));
              cb(null, require('./routes/kpidef/new'));
            });
          },
        },
        {
          path: '/kpi_def/edit',
          name: 'editKPIPage',
          breadcrumbName: '编辑KPI',
          parentName: 'KPIDefListPage',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 编辑KPI` : '编辑KPI';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/kpidef/edit'));
              cb(null, require('./routes/kpidef/edit'));
            });
          },
        },
        {
          path: '/kpi_def/view',
          name: 'viewKPIPage',
          breadcrumbName: '查看KPI',
          parentName: 'KPIDefListPage',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 查看KPI` : '查看KPI';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/kpidef/edit'));
              cb(null, require('./routes/kpidef/view'));
            });
          },
        },
        {
          path: '/kpi_def/copy',
          name: 'copyKPIPage',
          breadcrumbName: '复制KPI',
          parentName: 'KPIDefListPage',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 复制KPI` : '复制KPI';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/kpidef/copy'));
              cb(null, require('./routes/kpidef/copy'));
            });
          },
        },
        {
          path: '/kpi_def/assign',
          name: 'assignKPIPage',
          breadcrumbName: 'KPI分配',
          parentName: 'KPIDefListPage',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> KPI分配` : 'KPI分配';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/kpidef/assign'));
              cb(null, require('./routes/kpidef/assign'));
            });
          },
        },
        {
          path: '/tabs',
          name: 'tabsPage',
          breadcrumbName: '导航菜单',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/tabs'));
              cb(null, require('./routes/tabs/tabList'));
            });
          },
        },
        {
          path: '/tabs/add',
          name: 'tabCreatePage',
          breadcrumbName: '添加菜单',
          parentName: 'tabsPage',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 添加菜单` : '添加菜单';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/tabs'));
              cb(null, require('./routes/tabs/add'));
            });
          },
        },
        {
          path: '/tabs/edit',
          name: 'tabCreatePage',
          breadcrumbName: '编辑菜单',
          parentName: 'tabsPage',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 编辑菜单` : '编辑菜单';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/tabs'));
              cb(null, require('./routes/tabs/edit'));
            });
          },
        },
        {
          path: '/tabs/layout',
          name: 'tabLayoutPage',
          breadcrumbName: '布局菜单',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/tabs'));
              cb(null, require('./routes/tabs/layout'));
            });
          },
        },
        {
          path: '/duties',
          name: 'dutiesPage',
          breadcrumbName: '职务管理',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/duties'));
              cb(null, require('./routes/duties/list'));
            });
          },
        },
        {
          path: '/duties/add',
          name: 'addDuties',
          breadcrumbName: '添加职务',
          parentName: 'dutiesPage',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 添加职务` : '添加职务';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/duties'));
              cb(null, require('./routes/duties/add'));
            });
          },
        },
        {
          path: '/duties/edit',
          name: 'editDuties',
          breadcrumbName: '修改职务',
          parentName: 'dutiesPage',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 修改职务` : '修改职务';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/duties'));
              cb(null, require('./routes/duties/edit'));
            });
          },
        },
        {
          path: 'duties/distribution',
          name: 'Distribution',
          breadcrumbName: '职务分配',
          parentName: 'dutiesPage',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 职务分配` : '职务分配';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/public/transfer'));
              cb(null, require('./routes/publice/distribution'));
            });
          },
        },
        {
          path: '/department',
          name: 'departmentPage',
          breadcrumbName: '部门管理',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/department'));
              cb(null, require('./routes/department/list'));
            });
          },
        },
        {
          path: '/department/add',
          name: 'addDepartment',
          breadcrumbName: '添加部门',
          parentName: 'departmentPage',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 添加部门` : '添加部门';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/department'));
              cb(null, require('./routes/department/add'));
            });
          },
        },
        {
          path: '/department/edit',
          name: 'editDepartment',
          breadcrumbName: '修改部门',
          parentName: 'departmentPage',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 修改部门` : '修改部门';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/department'));
              cb(null, require('./routes/department/edit'));
            });
          },
        },
        {
          path: 'department/distribution',
          name: 'Distribution',
          breadcrumbName: '部门分配',
          parentName: 'departmentPage',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 部门分配` : '部门分配';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/public/transfer'));
              cb(null, require('./routes/publice/distribution'));
            });
          },
        },
        {
          path: 'trigger',
          name: 'trigger',
          breadcrumbName: '触发器设置',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/trigger/trigger'));
              cb(null, require('./routes/trigger/list'));
            });
          },
        },
        {
          path: 'trigger/:objectDescribeId/editor',
          name: 'triggerEditor',
          breadcrumbName: '新建编辑和查看',
          parentName: 'trigger',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 新建编辑和查看` : '新建编辑和查看';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/trigger/triggerEditor'));
              cb(null, require('./routes/trigger/editor'));
            });
          },
        },
        {
          path: 'action_script',
          name: 'actionScriptIndexPage',
          breadcrumbName: 'Action脚本',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/action_script/actionScript'));
              cb(null, require('./routes/action_script/list'));
            });
          },
        },
        {
          path: 'action_script/add',
          name: 'actionScriptCreatePage',
          breadcrumbName: '新建ActionScript',
          parentName: 'actionScriptIndexPage',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 新建` : '新建';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/action_script/actionScript'));
              cb(null, require('./routes/action_script/add'));
            });
          },
        },
        {
          path: '/action_script/edit',
          name: 'sequenceEditPage',
          breadcrumbName: '编辑',
          parentName: 'actionScriptIndexPage',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 编辑` : '编辑';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/action_script/actionScript'));
              cb(null, require('./routes/action_script/edit'));
            });
          },
        },
        {
          path: 'sequence',
          name: 'sequenceIndexPage',
          breadcrumbName: '序列设置',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/sequence/sequence'));
              cb(null, require('./routes/sequence/list'));
            });
          },
        },
        {
          path: '/sequence/add',
          name: 'sequenceCreatePage',
          breadcrumbName: '添加序列',
          parentName: 'sequenceIndexPage',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 添加序列` : '添加序列';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/sequence/sequence'));
              cb(null, require('./routes/sequence/add'));
            });
          },
        },
        {
          path: '/sequence/edit',
          name: 'sequenceEditPage',
          breadcrumbName: '修改序列',
          parentName: 'sequenceIndexPage',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 编辑序列` : '编辑序列';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/sequence/sequence'));
              cb(null, require('./routes/sequence/edit'));
            });
          },
        },
        {
          path: '/sequence/reset',
          name: 'sequenceEditPage',
          breadcrumbName: '重置序列',
          parentName: 'sequenceIndexPage',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 重置序列` : '重置序列';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/sequence/sequence'));
              cb(null, require('./routes/sequence/reset'));
            });
          },
        },
        {
          path: 'architecture',
          name: 'architecture',
          breadcrumbName: '架构导入管理',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/architecture'));
              cb(null, require('./routes/architecture/index'));
            });
          },
        },
        {
          path: 'newarchitecture',
          name: 'newarchitecture',
          breadcrumbName: '业务数据导入管理',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/architecture'));
              cb(null, require('./routes/newarchitecture/index'));
            });
          },
        },
        {
          path: 'object_page/:object_api_name/index_page',
          name: 'object_page',
          breadcrumbName: '布局渲染',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/object_page/index'));
              cb(null, require('./routes/object_page/index'));
            });
          },
        },
        {
          path: 'object_page/:object_api_name/:record_id/detail',
          name: 'object_page',
          breadcrumbName: '布局渲染',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/object_page/detail'));
              cb(null, require('./routes/object_page/detail'));
            });
          },
        },
        {
          path: 'object_page/:object_api_name/:record_id/edit',
          name: 'object_page',
          breadcrumbName: '布局渲染',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/object_page/index'));
              cb(null, require('./routes/object_page/index'));
            });
          },
        },

        {
          path: 'crm_alert',
          name: 'crm_alert',
          breadcrumbName: '通知设置',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/crm_setting/alertSetting'));
              cb(null, require('./routes/crm_setting/alertSetting'));
            });
          },
        },
        {
          path: 'crm_calendar',
          name: 'crm_calendar',
          breadcrumbName: '日历设置',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/crm_setting/calendarSetting'));
              cb(null, require('./routes/crm_setting/calendarSetting'));
            });
          },
        },
        {
          path: 'languageSetting',
          name: 'languageSetting',
          breadcrumbName: '默认语言',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/crm_setting/languageSetting'));
              cb(null, require('./routes/crm_setting/languageSetting'));
            });
          },
        },
        {
          path: 'metadata_sync/index',
          name: 'metadata_sync_index',
          breadcrumbName: '元数据同步',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/metadata_sync'));
              cb(null, require('./routes/metadata_sync/index'));
            });
          },
        },
        {
          path: 'translation',
          name: 'translation',
          breadcrumbName: '翻译列表',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/translation/index'));
              cb(null, require('./routes/translation/index'));
            });
          },
        },
        {
          path: 'translation/add',
          name: 'translation_add',
          breadcrumbName: '新建翻译',
          parentName: 'translation',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/translation/add'));
              cb(null, require('./routes/translation/add'));
            });
          },
        },
        {
          path: 'translation/edit',
          name: 'translation_edit',
          breadcrumbName: '编辑翻译',
          parentName: 'translation',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/translation/edit'));
              cb(null, require('./routes/translation/edit'));
            });
          },
        },
        {
          path: 'logoSetting',
          name: 'logoSetting',
          breadcrumbName: 'LOGO设置',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/crm_setting/logoSetting'));
              cb(null, require('./routes/crm_setting/logoSetting'));
            });
          },
        },
        {
          path: 'crm_setting/index',
          name: 'crm_setting/index',
          breadcrumbName: '全部设置',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/crm_setting/crm_setting'));
              cb(null, require('./routes/crm_setting/index'));
            });
          },
        },
        {
          path: 'crm_setting/edit',
          name: 'crm_setting/edit',
          breadcrumbName: '修改设置',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/crm_setting/crm_setting_edit'));
              cb(null, require('./routes/crm_setting/edit'));
            });
          },
        },
        {
          path: 'crm_setting/create',
          name: 'crm_setting/create',
          breadcrumbName: '新建设置',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/crm_setting/crm_setting_create'));
              cb(null, require('./routes/crm_setting/create'));
            });
          },
        },
        {
          path: 'data_export',
          name: 'data_export_index',
          breadcrumbName: '数据导出-脚本导出任务',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/data_export/export_history'));
              registerModel(require('./models/data_export/export_script'));
              registerModel(require('./models/data_export/table'));
              registerModel(require('./models/data_export/index'));
              cb(null, require('./routes/data_export/index'));
            });
          },
        },
        // {
        //   path: 'data_export/export_script',
        //   name: 'data_export_script_index',
        //   breadcrumbName: '数据导出-脚本管理',
        //   parentName: 'data_export_index',
        //   getBreadcrumbNameByState({ parentName = null }) {
        //     return parentName ? `[ ${parentName} ] -> 脚本管理` : '脚本管理';
        //   },
        //   getComponent(nextState, cb) {
        //     require.ensure([], (require) => {
        //       registerModel(require('./models/data_export/export_script'));
        //       cb(null, require('./routes/data_export/export_script'));
        //     });
        //   },
        // },
        {
          path: 'data_export/export_script_new',
          name: 'data_export_script_new',
          breadcrumbName: '数据导出-脚本新建',
          parentName: 'data_export_script_index',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 新建脚本` : '新建脚本';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/data_export/export_script_new'));
              cb(null, require('./routes/data_export/export_script_new'));
            });
          },
        },
        {
          path: 'data_export/export_script_edit',
          name: 'data_export_script_edit',
          breadcrumbName: '数据导出-脚本编辑',
          parentName: 'data_export_script_index',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 编辑脚本` : '编辑脚本';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/data_export/export_script_edit'));
              cb(null, require('./routes/data_export/export_script_edit'));
            });
          },
        },
        {
          path: 'data_export/export_script_detail',
          name: 'data_export_script_detail',
          breadcrumbName: '数据导出-脚本查看',
          parentName: 'data_export_script_index',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 查看脚本` : '查看脚本';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/data_export/export_script_edit'));
              cb(null, require('./routes/data_export/export_script_detail'));
            });
          },
        },
        {
          path: 'data_export/export_history_detail',
          name: 'data_export_history_detail',
          breadcrumbName: '数据导出-历史任务脚本查看',
          parentName: 'data_export_index',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 查看脚本` : '查看脚本';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/data_export/export_history_detail'));
              cb(null, require('./routes/data_export/export_history_detail'));
            });
          },
        },
        {
          path: 'schedule',
          name: 'scheduleIndexPage',
          breadcrumbName: '定时任务',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/schedule/schedule'));
              cb(null, require('./routes/schedule/list'));
            });
          },
        },
        {
          path: 'schedule/add',
          name: 'scheduleCreatePage',
          breadcrumbName: '新建定时任务',
          parentName: 'scheduleIndexPage',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 新建` : '新建';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/schedule/schedule'));
              cb(null, require('./routes/schedule/add'));
            });
          },
        },
        {
          path: '/schedule/edit',
          name: 'sequenceEditPage',
          breadcrumbName: '编辑',
          parentName: 'scheduleIndexPage',
          getBreadcrumbNameByState({ parentName = null }) {
            return parentName ? `[ ${parentName} ] -> 编辑` : '编辑';
          },
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/schedule/schedule'));
              cb(null, require('./routes/schedule/edit'));
            });
          },
        },

        {
          path: 'security_check/index',
          name: 'security_check/index',
          breadcrumbName: '安全策略',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/securityCheck'));
              cb(null, require('./routes/security_check/index'));
            });
          },
        },
        {
          path: 'security_check/edit',
          name: 'security_check/edit',
          breadcrumbName: '修改安全策略',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/securityCheck'));
              cb(null, require('./routes/security_check/edit'));
            });
          },
        },
        {
          path: 'security_check/add',
          name: 'security_check/add',
          breadcrumbName: '新建安全策略',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(require('./models/securityCheck'));
              cb(null, require('./routes/security_check/add'));
            });
          },
        },
        {
          path: 'flow_management/index',
          name: 'flow_management/index',
          breadcrumbName: '流程管理',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              // registerModel(require('./models/flow_management/index'));
              cb(null, require('./routes/flow_management/index'));
            });
          },
        },
        {
          path: 'model_management/index',
          name: 'model_management/index',
          breadcrumbName: '模板管理',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              // registerModel(require('./models/flow_management/index'));
              cb(null, require('./routes/model_management/index'));
            });
          },
        },
        {
          path: 'authentication_method/index',
          name: 'authentication_method/index',
          breadcrumbName: '认证方式',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              // registerModel(require('./models/flow_management/index'));
              cb(null, require('./routes/authentication_method/index'));
            });
          },
        },
        {
          path: 'sso/index',
          name: 'sso/index',
          breadcrumbName: '单点登录',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              // registerModel(require('./models/flow_management/index'));
              cb(null, require('./routes/sso/index'));
            });
          },
        },
        {
          path: 'sso/oauth',
          name: 'sso/oauth',
          breadcrumbName: 'oauth 管理配置',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              // registerModel(require('./models/flow_management/index'));
              cb(null, require('./routes/sso/oauth'));
            });
          },
        },
      ],
    },
  ];
};

const pickRouteProps = (route) => {
  return _.pick(route, ['path', 'name', 'breadcrumbName', 'parentName']);
};

export const flattenRoutesHandler = (routes = [], result = []) => {
  routes.forEach((route) => {
    result.push(pickRouteProps(route));
    if (!_.isEmpty(route.childRoutes)) {
      flattenRoutesHandler(route.childRoutes, result);
    }
  });
  return result;
};

export const flattenRoutes = () => {
  return flattenRoutesHandler(craftRoutes());
};
