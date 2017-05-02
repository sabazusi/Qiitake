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

export default class Search extends React.Component {
  render() {
    return (
      <NavigatorIOS
        style={{flex: 1}}
        initialRoute={{
          title: "検索",
          component: SearchContainer
        }}
      />
    )
  }
}

class SearchContainer extends React.Component {
  constructor() {
    super();
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      inputValue: '',
      optionIndex: 0,
      options: {
        favorite: dataSource.cloneWithRows(['fav1', 'fav2', 'fav3', 'fav4']),
        history: dataSource.cloneWithRows(['hist1', 'hist2', 'hist3', 'hist4', 'hist5', 'hist6', 'hist7'])
      }
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
      optionIndex,
      options
    } = this.state;

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
            onPress={(value) => this.pushToSearch(value)}
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
          <ListView
            dataSource={optionIndex === 0 ? options.favorite : options.history}
            renderRow={(data) => (
              <TouchableHighlight
                underlayColor="#fff"
                onPress={() => this.pushToSearch(data)}
              >
                <Text style={{fontSize: 20}}>{data}</Text>
              </TouchableHighlight>
            )}
          />
        </View>
      </View>
    );
  }
}
