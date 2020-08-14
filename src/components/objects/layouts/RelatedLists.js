import React, { Component } from 'react';
import { Tag } from 'antd';

class RelatedLists extends Component {
  constructor(props) {
    super(props);

    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler = (list) => {
    this.props.addHandler({
      type: 'relatedList',
      refObjDescribe: list.object_api_name,
      relatedListName: list.related_list_api_name,
    });
  }

  buildListItem = (list, layoutItem) => {
    return <Tag onClick={!layoutItem ? () => this.clickHandler(list) : null} color={!layoutItem ? 'blue' : ''} style={{ width: '100%', cursor: !layoutItem ? 'pointer' : 'default' }}>{list.related_list_label}</Tag>;
  }

  get content() {
    const { layout, lists } = this.props;
    const findInLayout = (list) => {
      return layout.object.containers[0].components.find(
        comp => comp.ref_obj_describe === list.object_api_name);
    };

    return lists.map((list) => {
      return (<div key={list.related_list_api_name} style={{ margin: '16px' }}>{this.buildListItem(list, findInLayout(list))}</div>);
    });
  }

  render() {
    return (
      <div className="RelatedLists">
        <h2>相关列表</h2>
        {this.content}
      </div>
    );
  }
}

export default RelatedLists;
