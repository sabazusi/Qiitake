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
          storage: props.storage,
          candidates: props.candidates
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
    this.props.storage.addSearchHistory(value);
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
    const {
      candidates
    } = this.props;
    const targetCandidates = candidates[optionIndex === 0 ? 'history' : 'history'];

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
