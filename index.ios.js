/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {
  TabBarIOS,
  AppRegistry,
  AsyncStorage,
  StyleSheet
} from 'react-native';

import Trend from './src/components/views/trend';
import Search from './src/components/views/search';
import Favorite from './src/components/views/favorite';
import Settings from './src/components/views/settings';

import ApiClient from './src/api/client';

const ACCESS_TOKEN_KEY = '@Qiitake:user:token';

export default class Qiitake extends React.Component {

  constructor() {
    super();

    this.state = {
      current: 'settings',
      isOpenLoginModal: false,
      user: {}
    };
  }


  componentDidMount() {
    const accessToken = AsyncStorage.getItem(ACCESS_TOKEN_KEY, (error, result) => {
      if (!error) {
        this.apiClient = new ApiClient(result || '');
      } else {
        this.apiClient = new ApiClient();
      }
      this.apiClient.getMyself()
        .then((res) => this.setState({ user: res }))
        .catch(() => {});
    });
  }

  onUpdateLoginStatus = () => {
    this.apiClient.getMyself()
      .then((res) => {
        this.setState({ user: res} );
        AsyncStorage.setItem(ACCESS_TOKEN_KEY, this.apiClient.accessToken);
      })
      .catch(() => alert('ユーザー情報の取得に失敗しました'));
  }

  render() {
    const {
      current,
      user
    } = this.state;

    return (
      <TabBarIOS
        unselectedTintColor="yellow"
        tintColor="white"
        unselectedItemTintColor="red"
        barTintColor="darkslateblue"
        style={styles.container}
      >
        <TabBarIOS.Item
          title="trend"
          selected={current === 'trend'}
          onPress={() => this.setState({current: 'trend'})}
        >
          <Trend
            apiClient={this.apiClient}
          />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="search"
          selected={current === 'search'}
          onPress={() => this.setState({current: 'search'})}
        >
          <Search />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="favorite"
          selected={current === 'favorite'}
          onPress={() => this.setState({current: 'favorite'})}
        >
          <Favorite />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="settings"
          selected={current === 'settings'}
          onPress={() => this.setState({current: 'settings'})}
        >
          <Settings
            apiClient={this.apiClient}
            onUpdateLoginStatus={this.onUpdateLoginStatus}
            user={user}
          />
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20
  }
});

AppRegistry.registerComponent('Qiitake', () => Qiitake);
