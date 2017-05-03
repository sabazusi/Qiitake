import React from 'react';
import {
  View,
  WebView
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

export default class PostItem extends React.Component {
  constructor() {
    super();
    this.state = {
      uri: ''
    };
  }

  componentDidMount() {
    this.props.apiClient.getPostMock()
      .then((post) => this.setState({uri: post.url}));
  }

  render() {
    const {
      uri
    } = this.state;
    return uri ? (
      <WebView source={{uri: uri.replace(/^(http:\/\/)/, 'https://')}} />
    ) : (
      <View>
        <Spinner visible={uri === ''} />
      </View>
    );
  }
}
