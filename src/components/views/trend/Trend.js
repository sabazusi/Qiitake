// @flow

import React from 'react';
import { NavigatorIOS } from 'react-native';
import TrendContainer from './TrendContainer';

import type ApiClient from '../../../api/client';

type Props = {
  apiClient: ApiClient
};

const Trend = (props: Props) => {
  return (
    <NavigatorIOS
      style={{flex: 1}}
      initialRoute={{
        title: '話題の投稿',
        component: TrendContainer,
        passProps: {
          apiClient: props.apiClient
        }
      }}
    />
  );
}

export default Trend;
