import React, { Component } from 'react';
import { Tag } from 'antd';

class FieldsList extends Component {
  constructor(props) {
    super(props);

    this.clickHandler = this.clickHandler.bind(this);
  }

  getUsedCountFromParent = (type, field, parent) => {
    if (!parent || Object.getOwnPropertyNames(parent).length <= 0) return 0;

    let fun;
    switch (type) {
      case 'layout':
        return this.getUsedCountFromParent('containers', field, parent.containers);
      case 'containers':
        fun = (container) => {
          return this.getUsedCountFromParent('components', field, container.components);
        };
        return this.sum(parent, fun);
      case 'components':
        fun = (component) => {
          if (component.type !== 'detail_form') return 0;
          return this.getUsedCountFromParent('fieldSection', field, component.field_sections);
        };
        return this.sum(parent, fun);
      case 'fieldSection':
        fun = (section) => {
          return this.getUsedCountFromParent('fields', field, section.fields);
        };
        return this.sum(parent, fun);
      case 'fields':
        return parent ? parent.filter(f => f.field === field.api_name).length : 0;
      default:
        return 0;
    }
  }

  clickHandler = (field) => {
    this.props.addHandler({ type: 'field', id: field });
  }

  sum = (collection, fun) => {
    let count = 0;
    for (const item of collection) {
      count += fun(item);
    }
    return count;
  }

  fieldComponentParse = (field, usedCount) => {
    return (
      <Tag onClick={!usedCount ? () => this.clickHandler(field.api_name) : null} color={!usedCount ? 'green' : ''} style={{ width: '100%', cursor: !usedCount ? 'pointer' : 'default' }}>
        {field.label}
      </Tag>
    );
  }

  get content() {
    const { fields, layout } = this.props;
    return fields.map((field) => {
      const usedCount = this.getUsedCountFromParent('layout', field, layout.object);
      return <div key={field.id} style={{ margin: '16px' }}>{this.fieldComponentParse(field, usedCount)}</div>;
    });
  }

  render() {
    return (
      <div className="FieldsList">
        <h2>可用字段</h2>
        {this.content}
      </div>
    );
  }
}

export default FieldsList;
