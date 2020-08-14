import React from 'react';
import { DatePicker } from 'antd';

const DateTime = ({ label, disabled }) => {
  return (
    <DatePicker style={{ width: '100%' }} placeholder={label} disabled={disabled} />
  );
};

export default DateTime;
