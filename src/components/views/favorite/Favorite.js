// @flow

import React from 'react';
import {
  Text,
  View,
  ListView,
  SegmentedControlIOS,
  NavigatorIOS
} from 'react-native';

export default class Favorite extends React.Component {
  render() {
    return (
      <NavigatorIOS
        style={{flex: 1}}
        initialRoute={{
          title: 'お気に入り投稿',
          component: FavoriteContainer
        }}
      />
    )
  }
}

class FavoriteContainer extends React.Component {
  constructor() {
    super();
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      optionIndex: 0,
      isLoggedIn: false,
      posts: {
        local: dataSource.cloneWithRows([
          'local-save-1',
          'local-save-2',
          'local-save-3',
          'local-save-4',
          'local-save-5',
          'local-save-6',
          'local-save-7'
        ]),
        stock: dataSource.cloneWithRows([
          'stock'
        ])
      }
    }
  }
  render() {
    const {
      optionIndex,
      posts
    } = this.state;

    return (
      <View style={{
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <SegmentedControlIOS
          style={{
            width: '90%',
            marginTop: 50
          }}
          values={['この端末', 'ストック']}
          selectedIndex={optionIndex}
          onChange={(event) => this.setState({optionIndex: event.nativeEvent.selectedSegmentIndex})}
        />
        <ListView
          style={{height: '100%'}}
          dataSource={optionIndex === 0 ? posts.local : posts.stock}
          renderRow={(data) => (<Text>{data}</Text>)}
        />
      </View>
    )
  }
}
