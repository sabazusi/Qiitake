// @flow

import React from 'react';
import {
  Button,
  View,
  WebView,
  Text,
  Modal
} from 'react-native';
import { QIITAKE_CLIENT_ID, QIITAKE_CLIENT_SECRET, QIITAKE_REDIRECT_URL } from 'react-native-dotenv';

import type ApiCLient from '../../../api/client';

type Props = {
  isOpen: boolean;
  onComplete: (accessToken: string) => void;
  onFail: () => void;
  apiClient: ApiClient;
  children?: *;
};

export default class LoginModal extends React.Component {
  loginStateCode: string;
  constructor() {
    super();
    this.loginStateCode = Math.random().toString();
  }

  changeState = (navState: {url?: string}) => {
    if (!navState.url) return;
    const { apiClient, onComplete, onFail } = this.props;
    const {
      code,
      state
    } = apiClient.getAuthenticationStatusFromAuthUrl(navState.url);
    if (code && state === this.loginStateCode) {
      this.props.apiClient.getAccessToken(code)
        .then((accessToken) => {
          onComplete(accessToken);
        })
        .catch((e) => {
          onFail();
          alert(e.message);
        })
    }
  };

  render() {
    const {
      isOpen,
      apiClient,
      children
    } = this.props;

    return (
      <View style={{flex: 1}}>
        { isOpen ? (
          <Modal animationType="slide">
            <WebView
              source={{
                uri: apiClient.getAuthPageUrl(this.loginStateCode)
              }}
              onNavigationStateChange={this.changeState}
            />
          </Modal>
        ) : children || null}
      </View>
    );
  }
}
