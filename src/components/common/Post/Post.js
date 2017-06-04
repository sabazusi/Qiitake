import React from 'react';
import {
  View,
  WebView
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toolbar from './Toolbar';
import type ApiClient from '../../../api/client';

type Props = {
  id: string,
  title: string,
  url: string;
  apiClient: ApiClient;
};

type State = {
  isStocked: boolean;
};

export default class PostItem extends React.Component<void, Props, State> {
  constructor() {
    super();
    this.state = {
      isStocked: false
    };
  }

  onPressStocking = () => {
    const {
      id,
      apiClient
    } = this.props;
    const { isStocked } = this.state;
    apiClient.updateStockingStatus(id, !isStocked)
      .then(() => this.setState({ isStocked: !isStocked }))
      .catch(() => alert('ストックの更新に失敗しました'));
  };

  componentDidMount() {
    const {
      id,
      apiClient
    } = this.props;
    apiClient.isStockedPost(id)
      .then((isStocked) => this.setState({ isStocked }));
  }

  render() {
    const { url } = this.props;
    const { isStocked } = this.state;

    return url ? (
      <View style={{flex: 1}}>
        <WebView source={{uri: url.replace(/^(http:\/\/)/, 'https://')}} />
        <Toolbar
          style={{
            backgroundColor: '#42c693'
          }}
          isStocked={isStocked}
          onPressStocking={this.onPressStocking}
        />
      </View>
    ) : (
      <View>
        <Spinner visible={true} />
      </View>
    );
  }
}
