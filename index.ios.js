// @flow

import React from 'react';
import {
  TabBarIOS,
  AppRegistry,
  AsyncStorage,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import Latest from './src/components/views/latest';
import Search from './src/components/views/search';
import Favorite from './src/components/views/favorite';
import Settings from './src/components/views/settings';

import ApiClient from './src/api/client';
import Storage from './src/utils/storage';

const TabTypes = {
  LATEST: 'latest',
  SEARCH: 'search',
  FAVORITE: 'favorite',
  SETTINGS: 'settings'
};

export default class Qiitake extends React.Component {
  storage: Storage;

  constructor() {
    super();

    this.storage = new Storage();
    this.apiClient = new ApiClient();
    this.state = {
      current: TabTypes.LATEST,
      isOpenLoginModal: false,
      user: {}
    };
  }


  componentWillMount() {
    this.storage.load()
      .then(() => {
        const accessToken = this.storage.getAccessToken();
        if (accessToken) {
          this.apiClient.updateAccessToken(accessToken);
          this.apiClient.getMyself()
            .then((res) => this.setState({ user: res }))
            .catch(() => {});
        }
      });
  }

  onUpdateLoginStatus = () => {
    this.apiClient.getMyself()
      .then((res) => {
        this.setState({ user: res } );
        this.storage.updateAccessToken(this.apiClient.accessToken);
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
        tintColor="#338ff1"
        barTintColor="#3bf23d"
        style={styles.container}
      >
        <Icon.TabBarItemIOS
          title="latest"
          iconName="group"
          selected={current === TabTypes.LATEST}
          onPress={() => this.setState({current: TabTypes.LATEST})}
        >
          <Latest apiClient={this.apiClient} />
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="search"
          iconName="search"
          selected={current === TabTypes.SEARCH}
          onPress={() => this.setState({current: TabTypes.SEARCH})}
        >
          <Search
            apiClient={this.apiClient}
            storage={this.storage}
          />
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="favorite"
          iconName="star"
          selected={current === TabTypes.FAVORITE}
          onPress={() => this.setState({current: TabTypes.FAVORITE})}
        >
          <Favorite />
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="settings"
          iconName="gears"
          selected={current === TabTypes.SETTINGS}
          onPress={() => this.setState({current: TabTypes.SETTINGS })}
        >
          <Settings
            apiClient={this.apiClient}
            onUpdateLoginStatus={this.onUpdateLoginStatus}
            user={user}
            storage={this.storage}
          />
        </Icon.TabBarItemIOS>
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
