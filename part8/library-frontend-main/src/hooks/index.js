import { useState } from 'react';

export const useField = (type, initialValue='') => {
  const [value, setValue] = useState(initialValue);

  const onChange = e => setValue(e.target.value);
  const reset = () => setValue('');

  return {
    type,
    value,
    onChange,
    reset
  };
};
