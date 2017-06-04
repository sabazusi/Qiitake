// @flow

import React from 'react';
import { NavigatorIOS, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import LoadablePostList from '../../common/LoadablePostList';

import type ApiClient from '../../../api/client';

type Props = {
  apiClient: ApiClient
};

type State = {
  hasInitialized: boolean;
}

class LatestList extends React.Component<void, Props, State> {
  constructor() {
    super();
    this.state = {
      hasInitialized: false
    };
  }

  fetchPosts = (page: number = 1) => {
    return this.props.apiClient.getLatestPosts(page)
      .then((posts) => {
        this.setState({ hasInitialized: true });
        return posts;
      })
      .catch(() => alert('投稿一覧の取得に失敗しました'));
  };

  render() {
    const {
      hasInitialized
    } = this.state;

    return (
      <View style={{
        marginTop: 50,
        marginBottom: 50
      }}>
        <Spinner visible={!hasInitialized} />
        <LoadablePostList
          apiClient={this.props.apiClient}
          onFetch={this.fetchPosts}
          navigator={this.props.navigator}
        />
      </View>
    );
  }
}

const Latest = (props: Props) => {
  return (
    <NavigatorIOS
      style={{flex: 1}}
      initialRoute={{
        title: '最新の投稿',
        component: LatestList,
        passProps: {
          apiClient: props.apiClient
        }
      }}
    />
  );
}

export default Latest;
