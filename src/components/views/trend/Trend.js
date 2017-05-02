// @flow

import React from 'react';
import {
  Text,
  View,
  ListView,
  TouchableHighlight,
  NavigatorIOS
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import type ApiClient from '../../../api/client';

type Props = {
  apiClient: ApiClient
};

type State = {
  isFetching: boolean;
  posts: Array<*>;
}

export default class Trend extends React.Component {
  render() {
    return (
      <NavigatorIOS
        style={{flex: 1}}
        initialRoute={{
          title: '話題の投稿',
          component: TrendList,
          passProps: {
            apiClient: this.props.apiClient
          }
        }}
      />
    );
  }
}

class PostItem extends React.Component {
  render() {
    return (
      <View>
        <Text>はい</Text>
      </View>
    );
  }
}

class TrendList extends React.Component<void, Props, State> {
  constructor() {
    super();
    this.state = {
      isFetching: false,
      posts: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    };
  }

  componentDidMount() {
    this.setState({isFetching: true});
    this.props.apiClient.getPostListMock()
      .then((res) => {
        this.setState({
          isFetching: false,
          posts: this.state.posts.cloneWithRows(res)
        });
      });
  }

  renderRow = (data: string) => {
    return (
      <TouchableHighlight
        underlayColor="#fff"
        onPress={() => {
          this.props.navigator.push({
            title: data,
            component: PostItem,
          })
        }}
      >
        <View>
          <View>
            <Text style={{
            fontSize: 24
          }}>{data}</Text>
          </View>
          <View style={{
            height: 1,
            backgroundColor: '#414141',
            marginTop: 3,
            marginBottom: 3,
          }} />
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    const {
      isFetching,
      posts
    } = this.state;
    return (
      <View>
        <Spinner visible={this.state.isFetching} />
        {
          isFetching ? null : (
            <ListView
              style={{
                marginTop: 50
              }}
              dataSource={posts}
              renderRow={this.renderRow}
            />
          )
        }
      </View>
    )
  }
}
