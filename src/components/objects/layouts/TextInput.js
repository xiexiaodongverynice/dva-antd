import React from 'react';
import { Input } from 'antd';

const TextInput = ({ label, disabled }) => {
  return (
    <Input type="text" addonBefore={label} disabled={disabled} />
  );
};

export default TextInput;
