/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  TabBarIOS,
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

class DummyView extends React.Component {
  render() {
    return (
      <View>
        <Text>a</Text>
      </View>
    );
  }
}

export default class Qiitake extends Component {
  render() {
    return (
      <TabBarIOS
        unselectedTintColor="yellow"
        tintColor="white"
        unselectedItemTintColor="red"
        barTintColor="darkslateblue"
      >
        <TabBarIOS.Item
          title="trend"
          selected
        >
          <DummyView />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="search"
        >
          <DummyView />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="favorite"
        >
          <DummyView />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="settings"
        >
          <DummyView />
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('Qiitake', () => Qiitake);
