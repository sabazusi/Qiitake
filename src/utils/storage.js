// @flow

import { AsyncStorage } from 'react-native';

export const StorageKeys = {
  // @string
  ACCESS_TOKEN: '@Qiitake:user:token',
  // @array<string>
  SEARCH_HISTORY: '@Qiitake:search:history',
  // @array<{id: string, title: string, user: {name: string, image_url: string}}}>
  LOCAL_STOCK: '@Qiitake:favs:local'
};

type Handler = (store: {}) => void;

export default class Storage {
  handlers: Array<Handler> = [];
  constructor() {
    this.store = {};
  }

  addChangeHandler(handler: Handler) {
    this.handlers.push(handler);
    return new Promise((resolve) => resolve(this.store));
  }

  executeHandlers() {
    this.handlers.forEach((handler) => handler(this.store));
  }

  load() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getAllKeys((error, keys) => {
        AsyncStorage.multiGet(keys, (error, store) => {
          store.forEach((store) => this.store[store[0]] = JSON.parse(store[1]));
          this.executeHandlers();
          resolve();
        });
      })
    });
  }

  getAccessToken() {
    return this.store[StorageKeys.ACCESS_TOKEN] || null;
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
        this.store[StorageKeys.ACCESS_TOKEN] = null;
        resolve();
      });
    });
  }

  addSearchHistory(word: string) {
    const current = this.store[StorageKeys.SEARCH_HISTORY] || [];
    let next;
    if (current.indexOf(word) > -1) {
      next = [word].concat(current.filter((exist) => exist !== word));
    } else {
      next = [word].concat(current);
    }

    return new Promise((resolve, reject) => {
      AsyncStorage.setItem(StorageKeys.SEARCH_HISTORY, JSON.stringify(next), (error) => {
        if (error) reject();
        this.store[StorageKeys.SEARCH_HISTORY] = next;
        this.executeHandlers();
        resolve();
      })
    })
  }

  updateStockingStatus(id: string, title: string, isStocking: false) {
  }

}
