import React, { Component } from 'react';
import FieldSection from './FieldSection';

class DetailForm extends Component {
  render() {
    const { field_sections: fieldSection,
            component_name: componentName } = this.props.comp;
    const { objectDescribe, handlers, selectItem } = this.props;
    return (
      <div>
        <h1>{componentName}</h1>
        <FieldSection
          sections={fieldSection}
          objectDescribe={objectDescribe}
          handlers={handlers}
          selectItem={selectItem}
        />
      </div>
    );
  }
}

export default DetailForm;
