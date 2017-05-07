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

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

type Props = {
  onFetch: (page: number) => Array<PostData>;
  navigator: {
    push: (state: {}) => void;
  };
};

type PostData = {
  title: string,
  url: string,
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

export default class LoadablePostList extends React.Component<void, Props, void> {
  listRef: HTMLElement;

  constructor() {
    super();
  }

  fetchPosts = (page: number = 1, callback: (data: *) => void, options: {}) => {
    this.props.onFetch(page)
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
