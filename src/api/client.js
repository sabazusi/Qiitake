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

  getLatestPosts(page: number = 1) {
    return this._fetch(`/api/v2/items?page=${page}`)
      .then((res) => res.json());
  }

  getPost(id: string) {
    return this._fetch(`/api/v2/items/${id}`)
      .then((res) => res.json());
  }

  getPostListByKeyword(keyword: string) {
  }

}
