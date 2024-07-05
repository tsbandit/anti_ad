(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {storage_get, storage_set, sleep} = Global.util;

Global.api_keys = {};

const create_api_caller = ({url, storage_key}) => {
  let api_key = undefined;

  // Manage API key storage:
  (async() => {
    while(true) {
      api_key = await storage_get(storage_key);

      if(api_key !== undefined)
        break;

      if(window.Global.api_keys[storage_key] !== undefined) {
        storage_set({api_key: window.api_key}).then(() => {
          console.log('Stored value in storage key ' + JSON.stringify(storage_key));
        });
      } else {
        console.log('Waiting for you to specify a value of window.Global.api_keys['+JSON.stringify(storage_key)+']');
      }

      await sleep(3000);
    }
    console.log('Loaded value from storage key ' + JSON.stringify(storage_key));
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
