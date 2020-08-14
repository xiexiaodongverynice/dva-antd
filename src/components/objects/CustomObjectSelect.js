import React, { Component } from 'react';
import { Select } from 'antd';
import styles from './CustomObjectSelect.css';

const Option = Select.Option;

class CustomObjectSelect extends Component {
  componentWillMount() {
    const { changeHandler, selected } = this.props;
    changeHandler(selected);
  }

  render() {
    const { objects, changeHandler, selected } = this.props;
    const options = objects.map(object =>
      <Option key={object.id} value={object.api_name}>{object.display_name}</Option>,
  );

    return (
      <div className={styles.loginForm}>
        <Select defaultValue={selected} onChange={changeHandler} style={{ width: 220 }}>
          {options}
        </Select>
      </div>
    );
  }
}

export default CustomObjectSelect;
