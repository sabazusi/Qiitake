// @flow

import { QIITAKE_CLIENT_ID, QIITAKE_CLIENT_SECRET, QIITAKE_REDIRECT_URL } from 'react-native-dotenv';
import parse from 'url-parse';

const QIITA_URL = 'https://qiita.com';

export default class ApiClient {
  accessToken: string;

  constructor(accessToken: string = '') {
    this.accessToken = accessToken;
  }

  _fetch(path: string, params: {} = {}) {
    return this.accessToken ? fetch(`${QIITA_URL}${path}`, Object.assign({}, params, {
      headers: Object.assign({}, params.headers || {}, {
        Authorization: `Bearer ${this.accessToken}`
      })
    })) : fetch(`${QIITA_URL}${path}`, params);
  }

  updateAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  getAuthPageUrl(loginStateCode: string) {
    return `${QIITA_URL}/api/v2/oauth/authorize?client_id=${QIITAKE_CLIENT_ID}&scope=read_qiita&state=${loginStateCode}`;
  }

  getAuthenticationStatusFromAuthUrl(url: string) {
    const currentUrl = parse(url, true);
    if (currentUrl.host === parse(QIITAKE_REDIRECT_URL, true).host) {
      return {
        code: currentUrl.query.code,
        state: currentUrl.query.state
      };
    } else {
      return {};
    }
  }

  getAccessToken(code: string) {
    return this._fetch('/api/v2/access_tokens', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'client_id': QIITAKE_CLIENT_ID,
        'client_secret': QIITAKE_CLIENT_SECRET,
        code
      })
    })
      .then((res) => {
        if (res.status === 201) {
          return res.json();
        }
        throw new Error("");
      })
      .then((jsonRes) => {
        return jsonRes.token || '';
      })
      .catch(() => {
        throw new Error('アクセストークンの取得に失敗しました');
      });
  }

  getMyself() {
    if (this.accessToken) {
      return this._fetch('/api/v2/authenticated_user')
        .then((res) => res.json())
        .catch(() => {
          throw new Error('ユーザー情報の取得に失敗しました');
        });
    } else {
      return new Promise((resolve, reject) => {
        reject();
      })
    }
  }

  getPostListMock() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          "post-1",
          "post-2",
          "post-3",
          "post-4",
          "post-5",
          "post-6"
        ]);
      }, 500);
    });
  }

  getPostMock() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this._fetch('/api/v2/items/27929395e3133b514516')
          .then((res) => resolve(res.json()));
        /**
        Qiita.setEndpoint('https://qiita.com');
        Qiita.Resources.Item.get_item('27929395e3133b514516')
          .then((res) => console.log(res))
          */
        /**
        resolve({
          title: 'Getting started for React-Native',
          content: 'Hello React Native'
        });
        */
      }, 500);
    });
  }

  getPostListByKeyword(keyword: string) {
  }

}
