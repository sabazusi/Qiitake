import React from 'react';
import {
  View,
  ActionSheetIOS
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

type Props = {
  style: {};
  postStatus: {
    isStockedLocal: boolean;
    isStockedGlobal: boolean;
  };
  onPressLocalStock: () => void;
  onPressGlobalStock: () => void;
};

const Toolbar = (props: Props) => {
  const showActionSheet = () => {
    const {
      isStockedLocal,
      isStockedGlobal
    } = props.postStatus;
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        isStockedLocal ? 'ローカルのストックから削除' : 'ローカルにストック',
        isStockedGlobal ? 'Qiitaのストックから削除' : 'Qiitaにストック',
        'キャンセル'
      ],
      cancelButtonIndex: 2
    }, (buttonIndex: number) => {
      switch(buttonIndex) {
        case 0:
          props.onPressLocalStock();
          break;

        case 1:
          props.onPressGlobalStock();
          break;

        default:
          break;
      }
    });
  };

  return (
    <View style={Object.assign({}, {
      width: '100%',
      bottom: 50,
      height: 30,
      backgroundColor: '#ff0',
      position: 'absolute'
    }, props.style)}>
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        marginTop: -20
      }}>
        <Icon
          name="star"
          color="#f1ea47"
          size={50}
          onPress={showActionSheet}
        />
      </View>
    </View>
  );
};

export default Toolbar;
