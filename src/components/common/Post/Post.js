import React from 'react';
import {
  View,
  WebView
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toolbar from './Toolbar';

type Props = {
  url: string;
};

const PostItem = (props: Props) => {
  return props.url ? (
    <View style={{flex: 1}}>
      <WebView source={{uri: props.url.replace(/^(http:\/\/)/, 'https://')}} />
      <Toolbar
        style={{
          backgroundColor: '#42c693'
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
