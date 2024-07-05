(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {storage_get, storage_set, sleep} = Global.util;

const create_api_caller = ({url, storage_key}) => {
  let api_key = undefined;

  (async() => {
    while(api_key === undefined) {
      if(window.api_key !== undefined) {
        storage_set({api_key: window.api_key});
      }
      api_key = await storage_get(storage_key);
      await sleep(3000);
    }
  })();

  const call_api = async(payload) => {
    const params = [url, {
      method: 'post',
      body: JSON.stringify({...payload, api_key}),
      headers: {
        'Content-Type': 'application/json',
      },
    }];
    console.log('fetch params', params);
    const response = await (await fetch(...params)).json();
    if(response.type === 'success') {
      return response.payload;
    } else {
      throw new Error('error in call_api()');
    }
  };

  return call_api;
};

const call_api = create_api_caller({
  url: 'http://localhost:6002/api',
  storage_key: 'api_key',
});

Global.call_api = {call_api};


})();
