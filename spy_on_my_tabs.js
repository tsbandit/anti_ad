(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {sleep, escalate} = Global.util;

const get_tabs = () => (new Promise((resolve) => {chrome.tabs.query({}, resolve);}));

const call_api = async(payload) => {
  const response = await (await fetch('http://localhost:6002/api', {
    method: 'post',
    body: JSON.stringify({...payload, api_key: window.api_key}),
    headers: {
      'Content-Type': 'application/json',
    },
  })).json();
  if(response.type === 'success') {
    return response.payload;
  } else {
    throw new Error('error in call_api()');
  }
};

const spy_on_my_tabs = async() => {
  const test_string = await (await fetch('http://localhost:6002')).text();
  console.log({test_string});

  while(true) {
    try {
      if(window.api_key === undefined) {
        console.log('waiting for api_key');
      } else {
        const response = await call_api({
          type: 'save browser tabs',
          api_key: window.api_key,
          browser_tabs: await get_tabs()
        });
      }
    } catch(e) {
      escalate(e);
    }

    await sleep(5000);
  }
};

Global.spy_on_my_tabs = {spy_on_my_tabs};


})();
