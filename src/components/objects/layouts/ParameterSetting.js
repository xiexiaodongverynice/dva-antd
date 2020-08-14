import React, { Component } from 'react';
import FieldSectionParamsForm from './FieldSectionParamsForm';
import FieldParamsForm from './FieldParamsForm';
import RelatedListParamsForm from './RelatedListParamsForm';
import RelatedListColumnParamsForm from './RelatedListColumnParamsForm';

class ParameterSetting extends Component {
  get form() {
    const { selectItem, params, changeHandler } = this.props;

    switch (selectItem.item.type) {
      case 'fieldSection':
        return params ? (
          <FieldSectionParamsForm
            id={selectItem.item.id}
            params={params}
            changeHandler={changeHandler}
          />
        ) : null;
      case 'field':
        return params ? (
          <FieldParamsForm
            id={selectItem.item.id}
            params={params}
            changeHandler={changeHandler}
          />
        ) : null;
      case 'relatedList':
        return params ? (
          <RelatedListParamsForm
            id={selectItem.item.id}
            params={params}
            changeHandler={changeHandler}
          />
        ) : null;
      case 'relatedListColumn':
        return params ? (
          <RelatedListColumnParamsForm
            id={selectItem.item.id}
            containerId={selectItem.container.id}
            params={params}
            changeHandler={changeHandler}
          />
        ) : null;
      default:
        return null;
    }
  }

  render() {
    return (
      <div className="ParameterSetting">
        <h2>属性设置</h2>
        {this.form}
      </div>
    );
  }
}

export default ParameterSetting;
