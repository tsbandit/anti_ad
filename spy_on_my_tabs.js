(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {storage_get, storage_set, sleep, escalate, make_state} = Global.util;
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

  const [get_dirty, set_dirty] = make_state(true);

  const listener = () => {set_dirty(true);};
  chrome.tabs.onActivated.addListener(listener);
  chrome.tabs.onActiveChanged.addListener(listener);
  chrome.tabs.onAttached.addListener(listener);
  chrome.tabs.onCreated.addListener(listener);
  chrome.tabs.onDetached.addListener(listener);
  chrome.tabs.onHighlightChanged.addListener(listener);
  chrome.tabs.onHighlighted.addListener(listener);
  chrome.tabs.onMoved.addListener(listener);
  chrome.tabs.onRemoved.addListener(listener);
  chrome.tabs.onReplaced.addListener(listener);
  chrome.tabs.onSelectionChanged.addListener(listener);
  chrome.tabs.onUpdated.addListener(listener);
  chrome.tabs.onZoomChange.addListener(listener);

  while(true) {
    try {
      if(get_dirty()) {
        const response = await call_api({
          type: 'save browser tabs',
          browser_tabs: reformat_tabs(await get_tabs()),
        });
        set_dirty(false);
      } else {
        await call_api({type: 'heartbeat'});
      }
    } catch(e) {
      escalate(e);
    }

    await sleep(5000);
  }
};

Global.spy_on_my_tabs = {spy_on_my_tabs};


})();
