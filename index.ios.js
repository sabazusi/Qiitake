// @flow

import React from 'react';
import {
  TabBarIOS,
  AppRegistry,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import New from './src/components/views/new';
import Search from './src/components/views/search';
import Stock from './src/components/views/stock';
import User from './src/components/views/user';

import LoginModal from './src/components/common/LoginModal';

import ApiClient from './src/api/client';
import Storage from './src/utils/storage';

const TabTypes = {
  NEW: 'new',
  SEARCH: 'search',
  STOCK: 'stock',
  USER: 'user'
};

export default class Qiitake extends React.Component {
  storage: Storage;

  constructor() {
    super();

    this.storage = new Storage();
    this.apiClient = new ApiClient();
    this.state = {
      isOpenLoginModal: false,
      current: TabTypes.NEW,
      user: {
        isProcessing: false
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
      user
    } = this.state;

    return (
      <TabBarIOS
        tintColor="#338ff1"
        barTintColor="#3bf23d"
        style={styles.container}
      >
        <Icon.TabBarItemIOS
          title="new"
          iconName="group"
          selected={current === TabTypes.NEW}
          onPress={() => this.setState({current: TabTypes.NEW})}
        >
          {this.withModal(<New apiClient={this.apiClient} />)}
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
            />
          )}
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="stock"
          iconName="star"
          selected={current === TabTypes.STOCK}
          onPress={() => this.setState({current: TabTypes.STOCK})}
        >
          {this.withModal(
            <Stock
              apiClient={this.apiClient}
              user={user}
              storage={this.storage}
              login={this.showLoginModal}
              logout={this.logout}
            />
          )}
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="user"
          iconName="gears"
          selected={current === TabTypes.USER}
          onPress={() => this.setState({current: TabTypes.USER })}
        >
          {this.withModal(
            <User
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
