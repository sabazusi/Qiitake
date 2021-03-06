// @flow

import React from 'react';
import {
  Text,
  TextInput,
  Button,
  View,
  ListView,
  NavigatorIOS,
  TouchableHighlight
} from 'react-native';
import { StorageKeys } from '../../../utils/storage';
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
          apiClient={this.props.apiClient}
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
      candidates: []
    };
  }

  onChangeStore = (store: {}) => {
    this.setState({
      candidates: store[StorageKeys.SEARCH_HISTORY] || []
    });
  };

  componentDidMount() {
    const {
      storage
    } = this.props;
    storage.addChangeHandler(this.onChangeStore)
      .then((store) => this.onChangeStore(store));
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

  _renderSeparator = (sectionID: number, rowID: number, adjacentRowHighlighted: bool) => {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: adjacentRowHighlighted ? 4 : 1,
          backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
        }}
      />
    );
  }

  render() {
    const {
      inputValue,
      candidates
    } = this.state;

    return (
      <View style={{
        marginTop: 70,
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <View style={{
          justifyContent: 'center',
          flexDirection: 'row'
        }}>
          <TextInput
            style={{
              height: 40,
              width: '80%',
              borderColor: 'gray',
              borderWidth: 1,
              paddingLeft: 10,
              paddingRight: 10
            }}
            onChangeText={(inputValue) => this.setState({inputValue})}
            returnKeyType="done"
            returnKeyLabel="検索"
            placeholder="タップして検索"
            onSubmitEditing={() => this.pushToSearch(this.state.inputValue)}
          />
        </View>
        <View style={{width: '90%', height: '80%'}}>
          {
            candidates.length > 0 ? (
              <ListView
                dataSource={this.dataSource.cloneWithRows(candidates)}
                renderRow={(data) => (
                  <TouchableHighlight
                    underlayColor="#fff"
                    onPress={() => this.pushToSearch(data)}
                  >
                    <Text style={{
                      fontSize: 20,
                      marginLeft: '5%',
                      marginTop: '2%',
                      marginBottom: '2%'
                    }}>
                      {data}
                    </Text>
                  </TouchableHighlight>
                )}
                renderSeparator={this._renderSeparator}
              />
            ) : (
              <Text
                style={{
                  fontSize: 20,
                  textAlign: 'center',
                  marginTop: '10%'
                }}
              >
                候補がありません
              </Text>
            )
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
