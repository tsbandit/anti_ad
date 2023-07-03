(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {storage_get, storage_set, sleep, escalate} = Global.util;
const {call_api} = Global.call_api;

const get_tabs = () => (new Promise((resolve) => {chrome.tabs.query({}, resolve);}));

const reformat_tabs = (tabs) => {
  const result = {};
  for(const tab of tabs) {
    result[tab.id] = tab;
  }
  return result;
};

const spy_on_my_tabs = async() => {
  const test_string = await (await fetch('http://localhost:6002')).text();
  console.log({test_string});

  while(true) {
    try {
      const response = await call_api({
        type: 'save browser tabs',
        browser_tabs: reformat_tabs(await get_tabs()),
      });
    } catch(e) {
      escalate(e);
    }

    await sleep(5000);
  }
};

Global.spy_on_my_tabs = {spy_on_my_tabs};


})();
