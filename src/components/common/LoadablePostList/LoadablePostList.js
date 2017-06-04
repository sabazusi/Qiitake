// @flow

import React from 'react';
import {
  Animated,
  Easing,
  Image,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import GiftedListView from 'react-native-gifted-listview';
import Icon from 'react-native-vector-icons/FontAwesome';
import Post from '../../common/Post';

import ApiClient from '../../../api/client';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

type Props = {
  apiClient: ApiClient;
  onFetch: (page: number) => Array<PostData>;
  navigator: {
    push: (state: {}) => void;
  };
};

type State = {
  isLoadable: boolean;
};

type PostData = {
  title: string;
  url: string;
  id: string;
};

class LoadingIcon extends React.Component {
  constructor() {
    super();
    this.state = {
      loadingIcon: new Animated.Value(0)
    };
    Animated.timing(this.state.loadingIcon, {
      toValue: 1 * 1000,
      duration: 2000 * 1000,
      easing: Easing.linear
    }).start()
  }

  render() {
    return (
      <Animated.View style={{
        width: 20
      }}>
        <AnimatedIcon
          name="hourglass-1"
          size={20}
          style={{transform: [{
            rotate: this.state.loadingIcon.interpolate({
              inputRange: [0, 1],
              outputRange: [ '0deg', '360deg' ]
            })
          }]}}
        />
      </Animated.View>
    );
  }
}

export default class LoadablePostList extends React.Component<void, Props, State> {
  listRef: HTMLElement;

  constructor() {
    super();
    this.state = {
      isLoadable: true
    };
  }

  fetchPosts = (page: number = 1, callback: (data: *) => void, options: {}) => {
    if (!this.state.isLoadable) return;
    this.props.onFetch(page)
      .then((posts) => {
        if (page === 1) {
          posts.push({ isLoadingDummy: true });
        } else {
          const current = this.listRef._getRows();
          if (!current[current.length - 1].isLoadingDummy) return;
          const loading = current.pop();
          this.listRef._setRows(current);
          if (posts.length > 0) {
            posts.push(loading);
          } else {
            this.setState({ isLoadable: false });
          }
        }
        callback(posts);
      })
      .catch(() => alert('投稿一覧の取得に失敗しました'));
  };


  renderRow = (data: PostData) => {
    if (!data) return null;
    return data.isLoadingDummy ? (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        marginBottom: 5,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <LoadingIcon />
        <Text style={{
          marginLeft: 15
        }}>読み込んでいます...</Text>
      </View>
    ) : (
      <TouchableHighlight
        underlayColor="#fff"
        onPress={() => {
          this.props.navigator.push({
            title: data.title,
            component: Post,
            passProps: {
              id: data.id,
              title: data.title,
              url: data.url,
              apiClient: this.props.apiClient
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
    return (
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
    );
  }
}
