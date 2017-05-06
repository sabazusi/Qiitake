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
    <WebView source={{uri: props.url.replace(/^(http:\/\/)/, 'https://')}} />
  ) : (
    <View>
      <Spinner visible={true} />
    </View>
  );
};
export default PostItem;
