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

import LoginModal from './src/components/common/LoginModal';

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
      isOpenLoginModal: false,
      current: TabTypes.LATEST,
      user: {
        isProcessing: false
      },
      search: {
        candidates: {
          fav: [],
          history: []
        }
      }
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

        this.setState({
          search: {
            candidates: this.storage.getSearchCandidates()
          }
        });
      });
  }

  showLoginModal = () => {
    this.setState({ isOpenLoginModal: true })
  };

  logout = () => {
    this.storage.removeAccessToken()
      .then(() => {
        this.setState({ user: {} });
        alert('ログアウトしました');
      });
  };

  onUpdateLoginStatus = () => {
    this.setState({ user: { isProcessing: true } });
    this.apiClient.getMyself()
      .then((res) => {
        setTimeout(() => this.setState({ user: res } ), 500);
        this.storage.updateAccessToken(this.apiClient.accessToken);
      })
      .catch(() => alert('ユーザー情報の取得に失敗しました'));
  }

  withModal = (children) => {
    return (
      <LoginModal
        isOpen={this.state.isOpenLoginModal}
        onComplete={(accessToken) => {
          this.setState({ isOpenLoginModal: false });
          this.apiClient.updateAccessToken(accessToken);
          this.onUpdateLoginStatus();
        }}
        onFail={() => this.setState({ isOpenLoginModal: false })}
        apiClient={this.apiClient}
      >
        {children}
      </LoginModal>
    );
  };

  render() {
    const {
      current,
      user,
      search
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
          {this.withModal(<Latest apiClient={this.apiClient} />)}
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="search"
          iconName="search"
          selected={current === TabTypes.SEARCH}
          onPress={() => this.setState({current: TabTypes.SEARCH})}
        >
          {this.withModal(
            <Search
              apiClient={this.apiClient}
              storage={this.storage}
              candidates={search.candidates}
            />
          )}
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="favorite"
          iconName="star"
          selected={current === TabTypes.FAVORITE}
          onPress={() => this.setState({current: TabTypes.FAVORITE})}
        >
          {this.withModal(<Favorite />)}
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="settings"
          iconName="gears"
          selected={current === TabTypes.SETTINGS}
          onPress={() => this.setState({current: TabTypes.SETTINGS })}
        >
          {this.withModal(
            <Settings
              apiClient={this.apiClient}
              user={user}
              storage={this.storage}
              login={this.showLoginModal}
              logout={this.logout}
            />
          )}
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
