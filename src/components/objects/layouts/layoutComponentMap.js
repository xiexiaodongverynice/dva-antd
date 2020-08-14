import React from 'react';
import DetailForm from './DetailForm';
import RelatedList from './RelatedList';

export default function layoutComponentMap(
  comp,
  objectsDescribe,
  apiName,
  handlers,
  selectItem,
  key) {
  switch (comp.type) {
    case 'detail_form':
      return (
        <DetailForm
          comp={comp}
          objectDescribe={objectsDescribe[apiName]}
          key={key}
          handlers={handlers}
          selectItem={selectItem}
        />
      );
    case 'related_list':
      return (
        <RelatedList
          comp={comp}
          apiName={apiName}
          objectsDescribe={objectsDescribe}
          key={key}
          handlers={handlers}
          selectItem={selectItem}
        />
      );
    default:
      return null;
  }
}
