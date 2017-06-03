// @flow

import React from 'react';
import {
  Text,
  View,
  ListView,
  SegmentedControlIOS,
  NavigatorIOS
} from 'react-native';
import LoadablePostList from '../../common/LoadablePostList';

const Favorite = (props) => {
  return (
    <NavigatorIOS
      style={{flex: 1}}
      initialRoute={{
        title: 'お気に入り投稿',
        component: FavoriteContainer,
        passProps: { ...props }
      }}
    />
  )
}
export default Favorite;

class FavoriteContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      optionIndex: 0
    }
  }

  componentDidMount() {
    const {
      user,
      apiClient
    } = this.props;
    if (user && user.id) {
      apiClient.getStocks(user.id)
        .then(res => console.log(res));
    }
  }

  onFetchPosts = (page: number) => {
    const {
      user,
      apiClient
    } = this.props;
    if (user && user.id) {
      return apiClient.getStocks(user.id, page);
    } else {
      return Promise.resolve([]);
    }
  };

  getCurrentList = () => {
    const {
      apiClient,
      navigator,
      user
    } = this.props;
    const { optionIndex } = this.state;
    if (optionIndex === 0) {
      return user && user.id ? (
        <LoadablePostList
          apiClient={apiClient}
          onFetch={this.onFetchPosts}
          navigator={navigator}
        />
      ) : null;
    } else {
      return null;
    }
  };

  render() {
    const {
      optionIndex
    } = this.state;
    
    return (
      <View style={{
        marginTop: 60,
      }}>
        <View style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <SegmentedControlIOS
            style={{
              width: '90%',
            }}
            values={['ストック', 'この端末']}
            selectedIndex={optionIndex}
            onChange={(event) => this.setState({optionIndex: event.nativeEvent.selectedSegmentIndex})}
          />
        </View>
        <View
          style={{
            height: '80%'
          }}
        >
          { this.getCurrentList() }
        </View>
      </View>
    )
  }
}
