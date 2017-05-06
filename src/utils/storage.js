// @flow

import { AsyncStorage } from 'react-native';

const Keys = {
  // @string
  ACCESS_TOKEN: '@Qiitake:user:token',
  // @array<string>
  SEARCH_HISTORY: '@Qiitake:search:history',
  // @array<string>
  SEARCH_FAV: '@Qiitake:search:fav',
  // @array<{id: string, title: string, user: {name: string, image_url: string}}}>
  LOCAL_STOCK: '@Qiitake:favs:local'
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
