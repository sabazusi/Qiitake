// @flow

import React from 'react';
import {
  Button,
  View,
  WebView,
  Text,
  Modal
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { QIITAKE_CLIENT_ID, QIITAKE_CLIENT_SECRET, QIITAKE_REDIRECT_URL } from 'react-native-dotenv';

import type ApiCLient from '../../../api/client';

type Props = {
  isOpen: boolean;
  onComplete: (accessToken: string) => void;
  apiClient: ApiClient;
  children?: *;
};

export default class LoginModal extends React.Component {
  loginStateCode: string;
  constructor() {
    super();
    this.loginStateCode = Math.random().toString();
    this.state = {
      isLoading: false
    };
  }

  changeState = (navState: {url?: string}) => {
    if (!navState.url) return;
    const { apiClient, onComplete } = this.props;
    const {
      code,
      state
    } = apiClient.getAuthenticationStatusFromAuthUrl(navState.url);
    if (code && state === this.loginStateCode) {
      this.setState({ isLoading: true });
      this.props.apiClient.getAccessToken(code)
        .then((accessToken) => {
          this.setState({ isLoading: false })
          onComplete(accessToken);
        })
        .catch((e) => {
          this.setState({ isLoading: false })
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
    const { isLoading } = this.state;

    return (
      <View style={{flex: 1}}>
        <Spinner visible={this.state.isLoading} />
        { isOpen && !isLoading ? (
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
