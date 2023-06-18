import React from 'react';
import {TextInput} from 'react-native';

const RoundedTextInput = (props: any) => {
  return (
    <TextInput
      style={{
        borderWidth: 1,
        borderRadius: 10,
        width:'100%',
        padding: 10,
        fontSize: 16,
        color: '#000'
      }}
      {...props}
    />
  );
};

export default RoundedTextInput;
