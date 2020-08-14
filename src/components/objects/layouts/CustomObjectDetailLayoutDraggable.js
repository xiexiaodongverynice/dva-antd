import React, { Component } from 'react';
import { Row, Col } from 'antd';
import layoutTypeMap from './layoutTypeMap';
import FieldsList from './FieldsList';
import RelatedLists from './RelatedLists';
import ParameterSetting from './ParameterSetting';
import Containers from './Containers';
import { findParentFromLayout, findFromLayout } from '../../../utils/customObjectDetailLayout';

class CustomObjectDetailLayout extends Component {
  handleSubmit = (e) => {
    this.props.submitHandler({ body: JSON.parse(e.values.layoutJson) });
  }

  get previewContent() {
    const { layout, objectsDescribe, apiName, handlers, selectItem } = this.props;
    if (!layout.object.layout_type) return null;
    return layoutTypeMap(layout.object, objectsDescribe, apiName, handlers, selectItem);
  }

  get parameters() {
    const { layout, objectsDescribe, selectItem } = this.props;

    let parent;
    switch (selectItem.item.type) {
      case 'fieldSection':
        parent = findParentFromLayout(layout.object, selectItem.item).field_sections;
        return parent.filter(s => s.id === selectItem.item.id)[0];
      case 'field':
        parent = findParentFromLayout(layout.object, selectItem.item);
        return parent.filter(f => f.field === selectItem.item.id)[0];
      case 'relatedList':
        parent = findParentFromLayout(layout.object, selectItem.item);
        return {
          item: parent.filter(f => f.ref_obj_describe === selectItem.item.id)[0],
          refObj: objectsDescribe[selectItem.item.id],
        };
      case 'relatedListColumn':
        parent = findFromLayout(layout.object, selectItem.container);
        return parent.fields.filter(f => f.field === selectItem.item.id)[0];
      default:
        return null;
    }
  }

  render() {
    const { layout,
            objectsDescribe,
            apiName,
            selectItem } = this.props;

    return (
      <div>
        <Row gutter={24}>
          <Col span={4}>
            <Containers addHandler={this.props.handlers.addHandler} />
            <FieldsList
              fields={objectsDescribe[apiName].fields}
              layout={layout}
              addHandler={this.props.handlers.addHandler}
            />
            <RelatedLists
              layout={layout}
              lists={objectsDescribe[apiName].relatedList}
              addHandler={this.props.handlers.addHandler}
            />
          </Col>
          <Col span={16}>
            {this.previewContent}
          </Col>
          <Col span={4}>
            <ParameterSetting
              params={this.parameters}
              selectItem={selectItem}
              changeHandler={this.props.handlers.changeHandler}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default CustomObjectDetailLayout;
