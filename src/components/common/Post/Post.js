import React from 'react';
import {
  View,
  WebView
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toolbar from './Toolbar';
import type Storage from '../../../utils/storage';
import type ApiClient from '../../../api/client';

type Props = {
  id: string,
  title: string,
  url: string;
  apiClient: ApiClient;
  isStockedLocal: boolean;
  storage: Storage;
};

type State = {
  isStockedGlobal: boolean;
};

export default class PostItem extends React.Component<void, Props, State> {
  constructor() {
    super();
    this.state = {
      isStockedGlobal: false
    };
  }

  onPressLocalStock = () => {
    const {
      id,
      title,
      storage,
      isStockedLocal
    } = this.props;

    storage.updateStockingStatus(id, title, !isStockedLocal)
      .catch(() => alert('Failed to update stocking status in local'));
  };

  onPressGlobalStock = () => {
    const {
      id,
      apiClient
    } = this.props;
    const { isStockedGlobal } = this.state;
    apiClient.updateStockingStatus(id, !isStockedGlobal)
      .then(() => this.setState({ isStockedGlobal: !isStockedGlobal }))
      .catch(() => alert('Failed to Stocking to Qiita'));
  };

  componentDidMount() {
    const {
      id,
      apiClient
    } = this.props;
    apiClient.isStockedPost(id)
      .then((isStocked) => this.setState({ isStockedGlobal: isStocked }));
  }

  render() {
    const {
      url,
      isStockedLocal
    } = this.props;

    const { isStockedGlobal } = this.state;

    return url ? (
      <View style={{flex: 1}}>
        <WebView source={{uri: url.replace(/^(http:\/\/)/, 'https://')}} />
        <Toolbar
          style={{
            backgroundColor: '#42c693'
          }}
          postStatus={{
            isStockedLocal,
            isStockedGlobal
          }}
          onPressLocalStock={this.onPressLocalStock}
          onPressGlobalStock={this.onPressGlobalStock}
        />
      </View>
    ) : (
      <View>
        <Spinner visible={true} />
      </View>
    );
  }
}
