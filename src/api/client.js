// @flow

export default class ApiClient {
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
        fetch('https://qiita.com/api/v2/items/27929395e3133b514516')
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
