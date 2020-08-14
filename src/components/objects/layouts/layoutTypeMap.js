import React from 'react';
import OneColumnLayout from './OneColumnLayout';

export default function layoutTypeMap(layout, objectsDescribe, apiName, handlers, selectItem) {
  switch (layout.layout) {
    case 'one_column':
      return (
        <OneColumnLayout
          containers={layout.containers}
          objectsDescribe={objectsDescribe}
          apiName={apiName}
          handlers={handlers}
          selectItem={selectItem}
        />
      );
    default:
      return null;
  }
}
