// @flow

import React from 'react';
import parse from 'url-parse';
import {
  Button,
  View,
  WebView,
  Text,
  Modal
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import LoginModal from '../../common/LoginModal';

export default class Settings extends React.Component {
  constructor() {
    super();
  }

  render() {
    const {
      login,
      logout,
      user
    } = this.props;

    return (
      <View
        style={{marginTop: 30}}
      >
        {
          user.isProcessing ? (
            <Spinner visible={true} />
          ) : user.name ?
            (
              <View>
                <Text>認証済み: {user.name}</Text>
                <Button
                  style={{margin: 5, fontSize: 10}}
                  title="認証解除"
                  onPress={logout}
                />
              </View>
            ) : (
              <Button
                style={{margin: 5, fontSize: 10}}
                title="認証"
                onPress={login}
              />
            )
        }
      </View>
    );
  }

  /**
  render_old() {
    const {
      user,
      apiClient,
      storage,
      onUpdateLoginStatus
    } = this.props;
    return (
      <View
        style={{marginTop: 30}}
      >
        <LoginModal
          isOpen={this.state.isOpenModal}
          onComplete={(accessToken) => {
            apiClient.updateAccessToken(accessToken);
            onUpdateLoginStatus();
            this.setState({isOpenModal: false})
          }}
          apiClient={apiClient}
        />
        {
          user.name ? (
            <View>
              <Text>認証済み: {user.name}</Text>
              <Button
                style={{margin: 5, fontSize: 10}}
                title="認証解除"
                onPress={() => {
                  storage.removeAccessToken()
                    .then(() => {
                      alert('認証を解除しました');
                      onUpdateLoginStatus(true);
                    })
                    .catch(() => alert('認証解除に失敗しました'));
                }}
              />
            </View>
          ) : (
            <Button
              style={{margin: 5, fontSize: 10}}
              title="認証"
              onPress={() => this.setState({isOpenModal: true})}
            />
          )
        }
      </View>
    )
  }
  */
}
