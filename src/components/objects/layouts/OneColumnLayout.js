import React, { Component } from 'react';
import layoutComponentMap from './layoutComponentMap';

class OneColumnLayout extends Component {
  get content() {
    const { containers, objectsDescribe, apiName, handlers, selectItem } = this.props;
    if (!containers || containers.length !== 1) {
      throw new Error('one column layout receive a invalid containers parameter');
    }

    return containers[0].components.map((comp, i) => {
      // console.log(comp);
      return layoutComponentMap(comp, objectsDescribe, apiName, handlers, selectItem, i);
    });
  }

  render() {
    return (
      <div>
        {this.content}
      </div>
    );
  }
}

export default OneColumnLayout;
