// @flow

import { AsyncStorage } from 'react-native';

const Keys = {
  ACCESS_TOKEN: '@Qiitake:user:token'
};

export default class Storage {
  constructor() {
    this.stores = {};
  }

  load() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getAllKeys((error, keys) => {
        AsyncStorage.multiGet(keys, (error, stores) => {
          stores.map((store) => this.stores[store[0]] = store[1]);
          resolve();
        });
      })
    });
  }

  getAccessToken() {
    return this.stores[Keys.ACCESS_TOKEN] || null;
  }

  updateAccessToken(accessToken: string) {
    return new Promsie((resolve, reject) => {
      AsyncStorage.setItem(Keys.ACCESS_TOKEN, accessToken, (error) => {
        if (error) reject();
        resolve();
      });
    });
  }
}
