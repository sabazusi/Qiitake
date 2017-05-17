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

const Settings = (props) => {
  const {
    login,
    logout,
    user
  } = props;

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

export default Settings;
