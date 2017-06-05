// @flow

import React from 'react';
import {
  Text,
  View,
  ListView,
  SegmentedControlIOS,
  NavigatorIOS
} from 'react-native';
import LoadablePostList from '../../common/LoadablePostList';

const Stock = (props) => {
  return (
    <NavigatorIOS
      style={{flex: 1}}
      initialRoute={{
        title: 'お気に入り投稿',
        component: StockContainer,
        passProps: { ...props }
      }}
    />
  )
}
export default Stock;

class StockContainer extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    const {
      user,
      apiClient
    } = this.props;
    if (user && user.id) {
      apiClient.getStocks(user.id)
        .then(res => console.log(res));
    }
  }

  onFetchPosts = (page: number) => {
    const {
      user,
      apiClient
    } = this.props;
    if (user && user.id) {
      return apiClient.getStocks(user.id, page);
    } else {
      return Promise.resolve([]);
    }
  };

  getCurrentList = () => {
    const {
      apiClient,
      navigator,
      user
    } = this.props;
    return user && user.id ? (
      <LoadablePostList
        apiClient={apiClient}
        onFetch={this.onFetchPosts}
        navigator={navigator}
      />
    ) : null;
  };

  render() {
    return (
      <View style={{
        marginTop: 60,
      }}>
        <View
          style={{
            height: '80%'
          }}
        >
          { this.getCurrentList() }
        </View>
      </View>
    )
  }
}
