import React, { Component } from 'react';
import { Table, Tag, Popover } from 'antd';
import style from './RelatedList.css';

const Column = Table.Column;

class RelatedList extends Component {
  constructor(props) {
    super(props);

    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler = (e, id) => {
    e.stopPropagation();
    this.props.handlers.selectHandler({ type: 'relatedList', id });
  }

  columnClickHandler = (e, list, id) => {
    e.stopPropagation();
    this.props.handlers.selectHandler({ type: 'relatedListColumn', id, container: { type: 'relatedList', id: list } });
  }

  buildTable = (columns) => {
    return (
      <Table pagination={false} rowKey="id">{columns}</Table>
    );
  }

  get content() {
    const { comp, objectsDescribe, selectItem, apiName } = this.props;
    const objectDescribe = objectsDescribe[comp.ref_obj_describe];
    if (!objectDescribe) return null;

    const list = objectsDescribe[apiName].relatedList.filter(l =>
      (l.related_list_api_name === comp.related_list_name),
    )[0];

    const columns = comp.fields && comp.fields.map((field) => {
      const objField = objectDescribe.fields.filter(f => (f.api_name === field.field))[0];
      const selectContainer = selectItem.container.type === 'relatedList' && selectItem.container.id === list.object_api_name;
      const selectColumn = selectItem.item.type === 'relatedListColumn' && selectItem.item.id === field.field;

      return (
        <Column
          title={
            <a onClick={e => this.columnClickHandler(e, comp.ref_obj_describe, field.field)}>
              {objField.label}
            </a>
          }
          dataIndex={field.field}
          key={field.field}
          className={selectContainer && selectColumn ? style.selectedColumn : ''}
        />
      );
    });

    return this.buildTable(columns);
  }

  closeHandler(e, id) {
    e.stopPropagation();
    const { selectItem } = this.props;
    const selected = selectItem.container.type === 'relatedList' && selectItem.container.id === id;
    if (selected) {
      this.props.handlers.selectHandler({});
    }
    this.props.handlers.deleteHandler({ type: 'relatedList', id });
    return false;
  }

  deleteButton = (handler) => {
    return <a onClick={handler}>Delete</a>;
  }

  render() {
    const { comp, apiName, objectsDescribe, selectItem } = this.props;
    const list = objectsDescribe[apiName].relatedList.filter(l =>
      (l.related_list_api_name === comp.related_list_name),
    )[0];
    const selected = selectItem.container.type === 'relatedList' && selectItem.container.id === list.object_api_name;
    return (
      <div style={{ margin: '16px' }}>
        <h2>{list.related_list_label}</h2>
        <Popover
          visible={selected && selectItem.item.type === 'relatedList'}
          placement="bottomRight"
          content={this.deleteButton(e => this.closeHandler(e, list.object_api_name))} trigger="click"
        >
          <Tag
            onClick={e => this.clickHandler(e, list.object_api_name)}
            style={{ width: '100%', height: '100%', minHeight: '100px' }}
            color={selected ? 'green' : ''}
          >
            {this.content}
          </Tag>
        </Popover>
      </div>
    );
  }
}

export default RelatedList;
