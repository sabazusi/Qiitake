import React from 'react';
import {
  Text,
  View,
  Image,
  TouchableHighlight
} from 'react-native';
import GiftedListView from 'react-native-gifted-listview';
import Post from '../../common/Post';

import type ApiClient from '../../../api/client';

type PostData = {
  title: string,
  url: string,
};

type Props = {
  apiClient: ApiClient
};

type State = {
  posts: Array<*>;
}

export default class TrendList extends React.Component<void, Props, State> {
  listRef: HTMLElement;
  constructor() {
    super();
    this.state = {
      posts: []
    };
  }

  fetchPosts = (page: number = 1, callback: (data: *) => void, options: {}) => {
    this.props.apiClient.getLatestPosts(page)
      .then((posts) => {
        if (page === 1) {
          posts.push({ isLoadingDummy: true });
        } else {
          const current = this.listRef._getRows();
          const loading = current.pop();
          this.listRef._setRows(current);
          posts.push(loading);
        }
        callback(posts);
      })
      .catch(() => alert('投稿一覧の取得に失敗しました'));
  };

  renderRow = (data: PostData) => {
    return data.isLoadingDummy ? (
      <Text>Now loading...</Text>
    ) : (
      <TouchableHighlight
        underlayColor="#fff"
        onPress={() => {
          this.props.navigator.push({
            title: data.title,
            component: Post,
            passProps: {
              url: data.url
            }
          })
        }}
      >
        <View>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            marginLeft: 5
          }}>
            <Image
              source={{uri: data.user['profile_image_url']}}
              style={{
                width: 30,
                height: 30
              }}
            />
            <Text style={{
            fontSize: 16,
            fontFamily: 'HiraginoSans-W3'
          }}>{data.title}</Text>
          </View>
          <View style={{
            height: 1,
            backgroundColor: '#dbd9d9',
            marginTop: 3,
            marginBottom: 10,
            marginLeft: 5,
            marginRight: 5
          }} />
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    const {
      posts
    } = this.state;

    return (
      <View style={{
        marginTop: 50,
        marginBottom: 50
      }}>
        <GiftedListView
          ref={(ref) => this.listRef = ref}
          rowView={this.renderRow}
          onFetch={this.fetchPosts}
          refreshable={true}
          enableEmptySections={true}
          customStyles={{
            paginationView: {
              backgroundColor: '#eee',
            },
          }}
          refreshableTintColor="blue"
          paginationFetchingView={() => null}
          paginationWaitingView={() => null}
          onEndReached={() => this.listRef._onPaginate()}
          onEndReachedThreshold={1}
        />
      </View>
    );
  }
}
