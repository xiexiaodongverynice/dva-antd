const qs = require('qs');
const Mock = require('mockjs');
const apiPrefix = '/data';

const customObjectsData = Mock.mock({
  'data|80-100': [
    {
	  id: 6699328829492224,
	  tenant_id: 'test_tenant_01',
	  create_by: 'test_user_01',
	  update_by: 'test_user_01',
	  is_deleted: false,
	  create_time: '2017-04-27T08:37:45.596+0000',
	  update_time: '2017-04-27T08:37:45.596+0000',
	  version: 0,
	  api_name: 'CustomObject1',
	  display_name: '自定义对象1',
	  package: 'test.crm',
	  define_type: 'custom',
	  description: '莫名其妙的一个描述1',
	  is_active: true,
    },

    {
	  id: 6699328829492225,
	  tenant_id: 'test_tenant_01',
	  create_by: 'test_user_01',
	  update_by: 'test_user_01',
	  is_deleted: false,
	  create_time: '2017-04-27T08:37:45.596+0000',
	  update_time: '2017-04-27T08:37:45.596+0000',
	  version: 0,
	  api_name: 'CustomObject2',
	  display_name: '自定义对象2',
	  package: 'test.crm',
	  define_type: 'custom',
	  description: '莫名其妙的一个描述2',
	  is_active: true,
    },

    {
	  id: 6699328829492226,
	  tenant_id: 'test_tenant_01',
	  create_by: 'test_user_01',
	  update_by: 'test_user_01',
	  is_deleted: false,
	  create_time: '2017-04-27T08:37:45.596+0000',
	  update_time: '2017-04-27T08:37:45.596+0000',
	  version: 0,
	  api_name: 'CustomObject3',
	  display_name: '自定义对象3',
	  package: 'test.crm',
	  define_type: 'custom',
	  description: '莫名其妙的一个描述3',
	  is_active: true,
    },
  ],
});

const customObjectDetailLayoutsData = Mock.mock({
  'data|80-100': [
    {
	  id: 6699328829492224,
	  tenant_id: 'test_tenant_01',
	  create_by: 'test_user_01',
	  update_by: 'test_user_01',
	  is_deleted: false,
	  create_time: '2017-04-27T08:37:45.596+0000',
	  update_time: '2017-04-27T08:37:45.596+0000',
	  version: 0,
	  api_name: 'CustomObjectLayout',
	  display_name: '默认布局',
	  terminal: '电脑',
	  is_active: true,
    },
  ],
});

const customObjectDetailLayoutData = [{
      id: '6699328829492224',
      tenant_id: 'test_tenant_01',
      create_by: 'test_user_01',
      update_by: 'test_user_01',
      is_deleted: false,
      create_time: '2017-04-27T08:37:45.596+0000',
      update_time: '2017-04-27T08:37:45.596+0000',
      version: 0,
      api_name: 'CustomObjectLayout',
      display_name: '默认布局',
      terminal: '电脑',
      is_active: true,
      "layout_type": 'one_column',
      "containers": [
	{
	  "container_id": 3,
	  "components": [
	    {
	      "type": "detail_form",
	      "object_describe_id": 6721252170992649,
	      "component_name": "RecordDetail",
	      "field_sections": [
		{
		  "header": "客户信息",
		  "columns" : "2",
		  "fieldsOrder" : "Z",
		  "fields": [
		    {
		      "field": "parent_account",
		      "required": true,
		      "readonly": false
		    },
		    {
		      "field": "employees"
		    },
		    {
		      "field": "industry"
		    },
		    {
		      "type": "place_holder"
		    }
		  ]
		},
		{
		  "header": "地址信息",
		  "columns" : "3",
		  "fieldsOrder" : "N",
		  "fields": [
		    {
		      "field": "parent_account",
		      "required": true,
		      "readonly": false
		    },
		    {
		      "field": "employees"
		    },
		    {
		      "field": "industry"
		    },
		    {
		      "type": "place_holder"
		    }
		  ]
		}
	      ],
	      "buttons": [
		{
		  "del": {
		    "operation": "DELETE_OBJECT"
		  },
		  "edit": {
		    "operation": "EDIT_OBJECT"
		  }
		}
	      ]
	    },
	    {
	      "type": "related_list",
	      "ref_obj_describe": "contact",
	      "related_list_name": "contact_of_customer",
	      "header": "Contacts",
	      "columns": [
		"name",
		"title",
		"email",
		"phone"
	      ],
	      "default_sort_by": "name",
	      "default_sort_order": "asc",
	      "actions": [
		{
		  "action": "DELETE",
		  "label": "Del"
		},
		{
		  "action": "EDIT",
		  "label": "Edit"
		}
	      ]
	    },
	    {
	      "type": "related_list",
	      "ref_obj_describe": "case",
	      "related_list_name": "case_of_customer",
	      "header": "Cases",
	      "columns": [
		"name",
		"type"
	      ],
	      "default_sort_by": "name",
	      "default_sort_order": "asc"
	    },
	    {
	      "type": "related_list",
	      "ref_obj_describe": "opportunity",
	      "related_list_name": "opportunity_of_product",
	      "header": "Opportunities",
	      "columns": [
		"name",
		"stage",
		"amount",
		"close_date"
	      ],
	      "default_sort_by": "name",
	      "default_sort_order": "asc",
	      "actions": [
		{
		  "action": "CLOSE",
		  "label": "Cls"
		},
		{
		  "action": "EDIT",
		  "label": "Edit"
		}
	      ],
	      "buttons": [
		{
		  "action": "NEW",
		  "label": "创建新的机会"
		}
	      ]
	    }
	  ]
	}
      ]
    },
    {
	  id: '6699328829492225',
	  tenant_id: 'test_tenant_01',
	  create_by: 'test_user_01',
	  update_by: 'test_user_01',
	  is_deleted: false,
	  create_time: '2017-04-27T08:37:45.596+0000',
	  update_time: '2017-04-27T08:37:45.596+0000',
	  version: 0,
	  api_name: 'CustomObjectLayout',
	  display_name: '默认布局',
	  terminal: '电脑',
	  is_active: true,
    },
];

const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null;
  }
  let data;

  for (const item of array) {
    console.log('****************');
    console.log(item);
    console.log(array);
    if (item[keyAlias] === key) {
      data = item;
      break;
    }
  }

  if (data) {
    return data;
  }
  return null;
};

const NOTFOUND = {
  message: 'Not Found',
  documentation_url: 'http://localhost:8000/request',
};

module.exports = {
  [`GET ${apiPrefix}/custom_objects`](req, res) {
    const { query } = req;
    let { pageSize, page, ...other } = query;
    pageSize = pageSize || 3;
    page = page || 1;

    const newData = customObjectsData.data;
    res.status(200).json({
      data: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
      head: {},
    });
  },

  [`GET ${apiPrefix}/custom_object_detail_layouts`](req, res) {
    const { query } = req;
    let { pageSize, page, ...other } = query;
    pageSize = pageSize || 1;
    page = page || 1;

    const newData = customObjectDetailLayoutsData.data;
    res.status(200).json({
      data: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
      head: {},
    });
  },

  [`GET ${apiPrefix}/custom_object_detail_layout/:id`](req, res) {
    const { id } = req.params;
    const data = queryArray(customObjectDetailLayoutData, id, 'id');

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json(NOTFOUND);
    }
  },

  [`PUT ${apiPrefix}/custom_object_detail_layout/:id`] (req, res) {
    const newData = req.body

    customObjectDetailLayoutData.shift()
    customObjectDetailLayoutData.unshift(newData)

    res.status(200).json({data: {data: true}})
  },
};
