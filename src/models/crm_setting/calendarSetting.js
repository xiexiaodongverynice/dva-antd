import { message } from 'antd';
import pathToRegexp from 'path-to-regexp';
import * as tenantSettingService from '../../services/tenantSetting';

const defaultCalendarSetting = {
  api_name: 'calendar_setting',
  value: `{
    "calendar_items":
      [
        {
          "ref_object":"call",
          "start_field":"start_time",
          "end_field": "end_time",
          "item_content":"{{name}}-{{customer__r.name}}",
          "popup":{
            "fields":[
              { "field" : "customer" },
              {
                "field" : "parent_customer"
              },
              {
                "field" : "start_time",
                "render_type" : "date_time",
                "date_time_format" : "yyyy-mm-dd HH:MM:ss"
              },
              {
                "field" : "end_time",
                "render_type" : "date_time",
                "date_time_format" : "yyyy-mm-dd HH:MM:ss"
              },
              {
                "field" : "done_time",
                "render_type" : "date_time",
                "date_time_format" : "yyyy-mm-dd HH:MM:ss"
              },
              {
                "field" : "purpose",
                "render_type" : "select_one"
              },
              {
                "field" : "type",
                "render_type" : "select_one"
              },
              {
                "field" : "status",
                "render_type" : "select_one"
              },
              {
                "field" : "channel",
                "render_type" : "select_one"
              }

            ]
          },
          "support_action":{},
          "legend":
            [
              {
                "id":11,
                "label":"拜访计划",
                "bg_color":"#cc00ff",
                "text_color":"#BEBAB9",
                "critiria":[],
                "record_type":"plan",
                "joiner":"and"
              },
              {
                "id":12,
                "label":"拜访记录（新建）",
                "bg_color":"#278AE2",
                "text_color":"#BEBAB9",
                "critiria":[
                  {
                    "field": "status",
                    "operator": "==",
                    "value": [
                      0
                    ]
                  }
                ],
                "joiner":"and",
                "record_type":"report"
              },
              {
                "id":13,
                "label":"拜访记录（完成）",
                "bg_color":"#1FCB24",
                "text_color":"#BEBAB9",
                "critiria":[
                  {
                    "field": "status",
                    "operator": "==",
                    "value": [
                      1
                    ]
                  }
                ],
                "joiner":"and",
                "record_type":"report"
              }
            ]
        },
        {
          "ref_object":"coach_feedback",
          "start_field":"coach_date",
          "item_content":"{{employee__r.name}}",
          "popup":{
            "fields":[
              { "field" : "manager" },
              { "field" : "employee" },
              { "field" : "type" },
              { "field" : "coach_date" },
              { "field" : "status" }
            ]
          },
          "support_action":{},
          "legend":
            [
              {
                "id":21,
                "label":"辅导记录",
                "bg_color":"#ff3300",
                "text_color":"#BEBAB9",
                "critiria":[],
                "joiner":"and"
              }
            ]
        },
        {
          "ref_object":"event",
          "start_field":"start_time",
          "end_field":"end_time",
          "item_content":"{{event_name}}}",
          "popup":{
            "fields":[
              {
                "field" : "name",
                "render_type" : "link"
              },
              {
                "field" : "location",
                "render_type" : "text"
              },
              {
                "field" : "start_time",
                "render_type" : "date_time",
                "date_time_format" : "yyyy-mm-dd HH:MM:ss"
              },
              {
                "field" : "end_time",
                "render_type" : "date_time",
                "date_time_format" : "yyyy-mm-dd HH:MM:ss"
              },
              {
                "field" : "status",
                "render_type" : "select_one"
              }
            ]
          },
          "support_action":{},
          "legend":
            [
              {
                "id":31,
                "label":"活动记录（已完成）",
                "bg_color":"#FF00FF",
                "text_color":"#BEBAB9",
                "critiria":[
                  {
                    "field": "status",
                    "operator": "==",
                    "value": [
                      1
                    ]
                  }
                ],
                "record_type":"event",
                "joiner":"and"
              }
            ]
        },
        {
          "ref_object":"time_off_territory",
          "start_field":"start_date",
          "end_field":"endtype_date",
          "item_content":"{{reason}}",
          "popup":{
            "fields":[
              { "field" : "user_info" },
              { "field" : "territory" },
              { "field" : "reason" },
              {
                "field" : "start_date",
                "render_type" : "date_time",
                "date_time_format" : "yyyy-mm-dd HH:MM:ss"
              },
              {
                "field" : "end_date",
                "render_type" : "date_time",
                "date_time_format" : "yyyy-mm-dd HH:MM:ss"
              },
              { "field" : "status" },
              { "field" : "remark" }
            ]
          },
          "support_action":{},
          "legend":
            [
              {
                "id":41,
                "label":"TOT",
                "bg_color":"#b5b5b5",
                "text_color":"#BEBAB9",
                "critiria":[
                  {
                    "field": "status",
                    "operator": "==",
                    "value": [
                      1
                    ]
                  }
                ],
                "record_type":"tot",
                "joiner":"and"
              }
            ]
        }
      ],
    "calendar_actions":[
      {
        "label" : "新建拜访计划",
        "action" : "ADD",
        "object_describe_api_name" : "call",
        "record_type" : "plan"
      },
      {
        "label" : "新建拜访记录",
        "action" : "ADD",
        "action_code" : "call_history",
        "object_describe_api_name" : "call",
        "record_type" : "report"
      },
      {
        "label" : "新建离岗",
        "action" : "ADD",
        "record_type" : "master",
        "object_describe_api_name" : "time_off_territory"
      },
    ]
  }`,
};

export default {
  namespace: 'crm_calendar_setting',
  state: {
    calendar_setting: defaultCalendarSetting,
    loading: true,
  },
  reducers: {
    save(state, { payload: { calendar_setting } }) {
      return { ...state, calendar_setting };
    },
  },
  effects: {
    *fetchCalendarSetting({ payload }, { call, put }) {
      try {
        const response = yield call(tenantSettingService.fetchSetting, 'calendar_setting');
        const calendar_setting = response.data.data.body;
        yield put({
          type: 'save',
          payload: {
            calendar_setting: Object.assign({ api_name: 'calendar_setting', value: '' }, calendar_setting),
          },
        });
      } catch (ex) {
        console.error(ex);
        message.error('获取日历设置失败');
      }
    },
    *saveOrUpdate({ payload }, { call, put }) {
      const response = yield call(tenantSettingService.createOrUpdate, payload);
      try {
        const calendar_setting = response.data.data.body;
        yield put({
          type: 'save',
          payload: {
            calendar_setting,
          },
        });
        message.success('保存成功');
      } catch (ex) {
        console.error(ex);
        message.error('保存失败');
      }
    },
  },
  subscriptions: {
    // 路由监听器
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        const match = pathToRegexp('/crm_calendar').exec(pathname);

        if (match) {
          dispatch({
            type: 'fetchCalendarSetting',
            payload: {},
          });
        }
      });
    },
  },
};
