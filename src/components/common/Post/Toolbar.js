import React from 'react';
import {
  View,
  Text
} from 'react-native';

const Toolbar = (props) => {
  return (
    <View style={Object.assign({}, {
      width: '100%',
      bottom: 50,
      height: 30,
      backgroundColor: '#ff0',
      position: 'absolute'
    }, props.style)}>
      <Text>toolbar</Text>
    </View>
  );
};

export default Toolbar;
