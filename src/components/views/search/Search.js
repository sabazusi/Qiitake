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
import type Strorage from '../../../utils/storage';
import type ApiClient from '../../../api/client';

const Search = (props) => {
  return (
    <NavigatorIOS
      style={{flex: 1}}
      initialRoute={{
        title: "検索",
        component: SearchContainer,
        passProps: {
          apiClient: props.apiClient,
          storage: props.storage
        }
      }}
    />
  );
}
export default Search;

type Props = {
  storage: Storage;
  apiClient: ApiClient;
};

class SearchContainer extends React.Component<void, Props, void> {
  dataSource: LostView.DataSource;
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
    this.props.navigator.push({
      title: `${value}の検索結果`,
      component: () => { return (<Text>はい</Text>) }
    });
  }

  render() {
    const {
      inputValue,
      optionIndex
    } = this.state;
    const {fav, history} = this.props.storage.getSearchCandidates();
    const candidates = optionIndex === 0 ? fav || [] : history || []

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
          />
          <Button
            style={{
              width: '20%',
              backgroundColor: '#b8b8b8'
            }}
            title="Search"
            accessibilityLabel="Search"
            onPress={() => this.pushToSearch(inputValue)}
          />
        </View>
        <SegmentedControlIOS
          style={{
            width: '90%',
            marginTop: 30
          }}
          values={['お気に入り', '検索履歴']}
          selectedIndex={optionIndex}
          onChange={(event) => this.setState({optionIndex: event.nativeEvent.selectedSegmentIndex})}
        />
        <View>
          {
            candidates.length > 0 ? (
              <ListView
                dataSource={this.dataSource.cloneWithRows(candidates)}
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
