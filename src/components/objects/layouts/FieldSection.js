import React, { Component } from 'react';
import { Tag, Input, Row, Col, Popover } from 'antd';
import PlaceHolder from './PlaceHolder';

class FieldSection extends Component {
  constructor(props) {
    super(props);

    this.sectionClickHandler = this.sectionClickHandler.bind(this);
    this.fieldClickHandler = this.fieldClickHandler.bind(this);
    this.closeHandler = this.closeHandler.bind(this);
    this.fieldsRow = this.fieldsRow.bind(this);
  }

  sectionClickHandler(e, id) {
    e.stopPropagation();
    this.props.handlers.selectHandler({ type: 'fieldSection', id });
  }

  fieldClickHandler(e, sectionId, id) {
    e.stopPropagation();
    this.props.handlers.selectHandler({ type: 'field', id, container: { type: 'fieldSection', id: sectionId } });
  }

  closeHandler(e, sectionId, fieldId) {
    e.stopPropagation();
    const { selectItem } = this.props;

    if (fieldId) {
      if (selectItem.container.id === sectionId && selectItem.item.id === fieldId) {
        this.props.handlers.selectHandler({});
      }
      this.props.handlers.deleteHandler({ type: 'field', sectionId, id: fieldId });
    } else {
      if (selectItem.container.id === sectionId) {
        this.props.handlers.selectHandler({});
      }
      this.props.handlers.deleteHandler({ type: 'fieldSection', id: sectionId });
    }
    return false;
  }

  fieldsRow(columns, sectionId, fields, base, objectDescribe) {
    const grids = [];
    const span = 24 / columns;
    for (let i = 0; i < columns; i += 1) {
      grids.push(
        <Col key={base + i} className="gutter-row" style={{ marginTop: '16px' }} span={span}>
          {this.fieldComponentParse(sectionId, fields[base + i], objectDescribe)}
        </Col>,
      );
    }
    return (
      <Row key={base / 3} gutter={16}>
        {grids}
      </Row>
    );
  }

  buildFields = (sectionId, fields, columns, objectDescribe) => {
    if (!fields) {
      return null;
    }
    const rows = [];

    for (let i = 0; i < fields.length; i += columns) {
      const row = this.fieldsRow(columns, sectionId, fields, i, objectDescribe);
      rows.push(row);
    }

    return rows;
  }

  fieldComponentParse = (sectionId, field, objectDescribe) => {
    const { selectItem } = this.props;
    if (!field) return null;
    if (field.type === 'place_holder') return <PlaceHolder />;

    const objField = objectDescribe.fields.filter(f => (f.api_name === field.field))[0];
    const selected = selectItem.container.type === 'fieldSection' &&
               selectItem.container.id === sectionId &&
               selectItem.item.type === 'field' &&
               selectItem.item.id === objField.api_name;

    const innerElem = <Input style={{ width: '100%' }} value={objField.label} disabled />;
    return (
      <Popover visible={selected} placement="bottomRight" content={this.deleteButton(e => this.closeHandler(e, sectionId, objField.api_name))} trigger="click">
        <Tag
          onClick={e => this.fieldClickHandler(e, sectionId, objField.api_name)}
          style={{ width: '100%', height: '100%', paddingLeft: '0px', paddingRight: '20px' }}
          color={selected ? '#00a854' : ''}
        >
          {innerElem}
        </Tag>
      </Popover>
    );
  }

  get content() {
    const { objectDescribe, selectItem } = this.props;

    const re = this.props.sections.map((section, i) => {
      const selected = selectItem.container.type === 'fieldSection' && selectItem.container.id === section.id;
      return (
        <div key={i} style={{ margin: '16px' }}>
          <h2>{section.header ? section.header : '标题'}</h2>
          <Popover visible={selected && selectItem.item.type === 'fieldSection'} placement="bottomRight" content={this.deleteButton(e => this.closeHandler(e, section.id))} trigger="click">
            <Tag
              onClick={e => this.sectionClickHandler(e, section.id)}
              style={{ width: '100%', height: '100%', minHeight: '100px' }}
              color={selected ? 'green' : ''}
            >
              {this.buildFields(section.id,
                                section.fields,
                                parseInt(section.columns, 10),
                                objectDescribe)}
            </Tag>
          </Popover>
        </div>
      );
    });

    return re;
  }

  deleteButton = (handler) => {
    return <a onClick={handler}>Delete</a>;
  }

  render() {
    return (
      <div className="FieldSection">
        {this.content}
      </div>
    );
  }
}

export default FieldSection;
