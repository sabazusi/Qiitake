// @flow

import React from 'react';
import {
  TabBarIOS,
  AppRegistry,
  AsyncStorage,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import Trend from './src/components/views/trend';
import Search from './src/components/views/search';
import Favorite from './src/components/views/favorite';
import Settings from './src/components/views/settings';

import ApiClient from './src/api/client';
import Storage from './src/utils/storage';

export default class Qiitake extends React.Component {
  storage: Storage;

  constructor() {
    super();

    this.storage = new Storage();
    this.apiClient = new ApiClient();
    this.state = {
      current: 'trend',
      isOpenLoginModal: false,
      user: {}
    };
  }


  componentDidMount() {
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
        this.setState({ user: res} );
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
          title="trend"
          iconName="group"
          selected={current === 'trend'}
          onPress={() => this.setState({current: 'trend'})}
        >
          <Trend apiClient={this.apiClient} />
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="search"
          iconName="search"
          selected={current === 'search'}
          onPress={() => this.setState({current: 'search'})}
        >
          <Search />
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="favorite"
          iconName="star"
          selected={current === 'favorite'}
          onPress={() => this.setState({current: 'favorite'})}
        >
          <Favorite />
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="settings"
          iconName="gears"
          selected={current === 'settings'}
          onPress={() => this.setState({current: 'settings'})}
        >
          <Settings
            apiClient={this.apiClient}
            onUpdateLoginStatus={this.onUpdateLoginStatus}
            user={user}
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
