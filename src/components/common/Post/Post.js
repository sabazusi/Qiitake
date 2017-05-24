import React from 'react';
import {
  View,
  WebView
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

type Props = {
  url: string;
};

const PostItem = (props: Props) => {
  return props.url ? (
    <View style={{flex: 1}}>
      <WebView source={{uri: props.url.replace(/^(http:\/\/)/, 'https://')}} />
      <View
        style={{
          width: '100%',
          bottom: 50,
          height: 30,
          backgroundColor: '#ff0',
          position: 'absolute'
        }}
      />
    </View>
  ) : (
    <View>
      <Spinner visible={true} />
    </View>
  );
};
export default PostItem;
