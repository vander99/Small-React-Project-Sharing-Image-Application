import React from 'react';
import { TextInput } from 'react-native-gesture-handler';

const TextInput2 = ({
  style,
  placeholderStyle,
  value,
  ...rest
}) => (
  <TextInput
    {...rest}
    style={!value ? [style, placeholderStyle] : style}
  />
);

export default TextInput2;