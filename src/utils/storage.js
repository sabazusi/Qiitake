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
          stores.map((store) => this.stores[store[0]] = JSON.parse(store[1]));
          resolve();
        });
      })
    });
  }

  getAccessToken() {
    return this.stores[Keys.ACCESS_TOKEN] || null;
  }

  getSearchCandidates() {
    return {
      fav: this.stores[Keys.SEARCH_FAV] || [],
      history: this.stores[Keys.SEARCH_HISTORY] || []
    };
  }

  updateAccessToken(accessToken: string) {
    return new Promise((resolve, reject) => {
      AsyncStorage.setItem(Keys.ACCESS_TOKEN, JSON.stringify(accessToken), (error) => {
        if (error) reject();
        resolve();
      });
    });
  }

  addSearchHistory(word: string) {
    const current = this.stores[Keys.SEARCH_HISTORY] || [];
    let next;
    if (current.indexOf(word) > -1) {
      next = [word].concat(current.filter((exist) => exist !== word));
    } else {
      next = [word].concat(current);
    }

    return new Promise((resolve, reject) => {
      AsyncStorage.setItem(Keys.SEARCH_HISTORY, JSON.stringify(next), (error) => {
        if (error) reject();
        this.stores[Keys.SEARCH_HISTORY] = next;
        resolve();
      })
    })
  }

}
