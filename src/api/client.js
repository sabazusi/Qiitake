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
        resolve({
          title: 'Getting started for React-Native',
          content: 'Hello React Native'
        });
      }, 2000);
    });
  }
}
