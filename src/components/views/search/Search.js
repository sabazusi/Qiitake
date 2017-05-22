// @flow

import React from 'react';
import {
  Text,
  TextInput,
  Button,
  View,
  ListView,
  NavigatorIOS,
  TouchableHighlight,
  SegmentedControlIOS
} from 'react-native';
import LoadablePostList from '../../common/LoadablePostList';
import type Strorage from '../../../utils/storage';
import type ApiClient from '../../../api/client';

type Props = {
  storage: Storage;
  apiClient: ApiClient;
};

class SearchResult extends React.Component {
  onFetchPosts = (page: number) => {
    const {
      apiClient,
      keyword
    } = this.props;
    return apiClient.getPostListByKeyword(keyword, page);
  };

  render() {
    return (
      <View style={{
        marginTop: 50,
        marginBottom: 50
      }}>
        <LoadablePostList
          onFetch={this.onFetchPosts}
          navigator={this.props.navigator}
        />
      </View>
    );
  }
}

class SearchContainer extends React.Component<void, Props, void> {
  dataSource: ListView.DataSource;
  constructor() {
    super();
    this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      inputValue: '',
      optionIndex: 0
    };
  }

  pushToSearch(value) {
    if (!value) return;
    const {
      storage,
      navigator,
      apiClient
    } = this.props;
    storage.addSearchHistory(value);
    navigator.push({
      title: `${value}の検索結果`,
      component: () => (
        <SearchResult
          apiClient={apiClient}
          navigator={navigator}
          keyword={value}
        />
      )
    });
  }

  render() {
    const {
      inputValue,
      optionIndex
    } = this.state;
    const {
      candidates
    } = this.props;
    const targetCandidates = candidates[optionIndex === 0 ? 'history' : 'fav'];

    return (
      <View style={{
        marginTop: 100,
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <View style={{
          justifyContent: 'center',
          flexDirection: 'row'
        }}>
          <TextInput
            style={{height: 40, width: '70%', borderColor: 'gray', borderWidth: 1}}
            onChangeText={(inputValue) => this.setState({inputValue})}
            returnKeyType="done"
            returnKeyLabel="検索"
            onSubmitEditing={() => this.pushToSearch(this.state.inputValue)}
          />
        </View>
        <SegmentedControlIOS
          style={{
            width: '90%',
            marginTop: 30
          }}
          values={['検索履歴', 'お気に入り']}
          selectedIndex={optionIndex}
          onChange={(event) => this.setState({optionIndex: event.nativeEvent.selectedSegmentIndex})}
        />
        <View>
          {
            targetCandidates.length > 0 ? (
              <ListView
                dataSource={this.dataSource.cloneWithRows(targetCandidates)}
                renderRow={(data) => (
                  <TouchableHighlight
                    underlayColor="#fff"
                    onPress={() => this.pushToSearch(data)}
                  >
                    <Text style={{fontSize: 20}}>{data}</Text>
                  </TouchableHighlight>
                )}
              />
            ) : null
          }
        </View>
      </View>
    );
  }
}

const Search = (props) => {
  return (
    <NavigatorIOS
      style={{flex: 1}}
      initialRoute={{
        title: "検索",
        component: SearchContainer,
        passProps: { ...props }
      }}
    />
  );
}
export default Search;
