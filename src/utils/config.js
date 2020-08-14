// const baseAddress = 'https://prod-tm.crmpower.cn';
// const ssoAddress = 'https://prod-sso.crmpower.cn';

// const baseAddress = 'https://stg-tm.crmpower.cn';
// const ssoAddress = 'https://stg-sso.crmpower.cn';

const baseAddress = 'http://dev-tm.crmpower.cn';
const ssoAddress = 'http://dev-sso.crmpower.cn';
const fsAddress = 'http://dev-fs.crmpower.cn';
const dataExportAddress = 'http://dev-data-export.crmpower.cn';

// const baseAddress = 'http://localhost:8098';
// const ssoAddress = 'http://localhost:8090';

module.exports = {
  baseURL: baseAddress,
  ssoURL: `${ssoAddress}/login`,
  logoutURL: `${ssoAddress}/logout`,
  YQL: ['http://www.zuimeitianqi.com'],
  CORS: ['http://localhost:7000'],
  FS: fsAddress,
  DATA_EXPORT_BASE: dataExportAddress,
  apiPrefix: '/api/v1',
  workFlowURL: 'http://dev-workfolw.territorypower.cn', //* 外嵌工作流地址
  // https://stg-workflow.territorypower.cn  //* 认真看地址单词（workflow）有坑
  // https://workflow.territorypower.cn
  api: {
    query: '/rest/field_query/',
    duty: '/rest/data_record/duty',
    department: '/rest/data_record/department',
    role: '/rest/data_record/role',
    group: '/rest/data_record/permission_set',
    dashboard: '/dashboard',
    data_record: '/rest/data_record',
    custom_object: '/rest/metadata/object_describe/:id', // includeFields=false
    custom_objects_all: '/rest/metadata/object_describe/all',
    custom_objects_page: '/rest/metadata/object_describe/page',
    custom_object_layout: '/rest/metadata/layout',
    layout_assign: '/rest/metadata/layout_assign',
    common_query: '/rest/data_record/query',
    // custom_objects:'http://jsonplaceholder.typicode.com/users',
    custom_all_fields: '/rest/metadata/object_describe/:objId/fields',
    custom_fields_page: '/rest/metadata/object_describe/:objId/fields/page',
    custom_field: '/rest/metadata/object_describe/:objId/fields/:id',
    // user
    user_query: '/rest/query/user_info',
    user_data: '/rest/data_record/user_info',
    profile_data: '/rest/data_record/profile',
    profile_query: '/rest/query/profile',
    profile_configuration: '/rest/metadata/object_describe/updateProfileExt',
    sub_baseUrl: '/rest/data_record',
    metadata_baseUrl: '/rest/metadata',
    tab: '/rest/metadata/tab',
    sequence: '/rest/metadata/sequence',
    translation: '/rest/metadata/translation',
    function_permission: '/rest/metadata/function_permission',
    // layout api
    layout: '/rest/metadata/layout/:id',
    layout_by_object_layoutType: '/rest/metadata/layout/{objectApiName}/{layoutType}',
    layout_list_by_object: '/rest/metadata/layout/list/{objectApiName}',
    record_data_upload: '/rest/upload/{api_name}',
    record_data_download: '/rest/download/{api_name}',
    metadata_upload: '/rest/upload/metadata/',
    tenant_setting: '/rest/metadata/setting',
    approval_flow: '/rest/metadata/approval_flow',

    trigger_page: '/trigger/page',
    action_script: '/rest/metadata/actionScript',
    schedule: '/rest/metadata/schedule',

    scm: '/rest/scm/',

    kpiDef: '/rest/metadata/kpi_def',
    kpiAssign: '/rest/metadata/kpi_assign',

    approval_flow_assign: '/rest/metadata/approval_flow_assign/assign',

    security_check: '/rest/metadata/security_check',
    ssoquery: '/rest/sso/config',
    authquery: '/rest/login/auth',
    oauthquery: '/rest/sso/oauth/config',

    op_app_list: '/rest/metadata/tenant/one',
  },
  data_export_api: {
    export_history: '/rest/metadata/export_history',
    export_history_log: '/rest/metadata/export_history_log',
    export_script: '/rest/metadata/export_script',
    export_script_async: '/rest/async/metadata/export_script',
  },
  fs_api: {
    files: '/rest/files/',
  },
};
