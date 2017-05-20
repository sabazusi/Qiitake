// @flow

import { AsyncStorage } from 'react-native';

export const StorageKeys = {
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
  constructor(onChangeHandler: (stores: {}) => void) {
    this.stores = {};
    this.handler = onChangeHandler;
  }

  load() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getAllKeys((error, keys) => {
        AsyncStorage.multiGet(keys, (error, stores) => {
          stores.forEach((store) => this.stores[store[0]] = JSON.parse(store[1]));
          this.handler(this.stores);
          resolve();
        });
      })
    });
  }

  getAccessToken() {
    return this.stores[StorageKeys.ACCESS_TOKEN] || null;
  }

  updateAccessToken(accessToken: string) {
    return new Promise((resolve, reject) => {
      AsyncStorage.setItem(StorageKeys.ACCESS_TOKEN, JSON.stringify(accessToken), (error) => {
        if (error) reject();
        resolve();
      });
    });
  }

  removeAccessToken() {
    return new Promise((resolve,reject) => {
      AsyncStorage.removeItem(StorageKeys.ACCESS_TOKEN, (error) => {
        if (error) reject();
        this.stores[StorageKeys.ACCESS_TOKEN] = null;
        resolve();
      });
    });
  }

  addSearchHistory(word: string) {
    const current = this.stores[StorageKeys.SEARCH_HISTORY] || [];
    let next;
    if (current.indexOf(word) > -1) {
      next = [word].concat(current.filter((exist) => exist !== word));
    } else {
      next = [word].concat(current);
    }

    return new Promise((resolve, reject) => {
      AsyncStorage.setItem(StorageKeys.SEARCH_HISTORY, JSON.stringify(next), (error) => {
        if (error) reject();
        this.stores[StorageKeys.SEARCH_HISTORY] = next;
        this.handler(this.stores);
        resolve();
      })
    })
  }

}
