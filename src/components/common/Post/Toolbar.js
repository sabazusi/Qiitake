import React from 'react';
import {
  View,
  ActionSheetIOS
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

type Props = {
  style: {};
  isStocked: boolean;
  onPressStocking: () => void;
};

const Toolbar = (props: Props) => {
  const showActionSheet = () => {
    const { isStocked } = props;
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        isStocked ? 'Qiitaのストックから削除' : 'Qiitaにストック',
        'キャンセル'
      ],
      cancelButtonIndex: 1
    }, (buttonIndex: number) => {
      switch(buttonIndex) {
        case 0:
          props.onPressStocking();
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
