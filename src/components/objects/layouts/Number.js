import React from 'react';
import { InputNumber } from 'antd';

const Number = ({ label, disabled }) => {
  return (
    <InputNumber style={{ width: '100%' }} defaultValue={label} disabled={disabled} />
  );
};

export default Number;
