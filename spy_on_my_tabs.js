(() => {


'use strict';

const Global = window.Global = window.Global || {};

// const {sleep, make_state} = Global.util;

const spy_on_my_tabs = async() => {
  console.log('tommy 1', chrome);
  const x = await new Promise((resolve) => {chrome.tabs.query({}, resolve);});

  console.log('tommy 2', x);

  const test_string = await (await fetch('http://localhost:6001')).text();
  console.log(test_string);
};

Global.spy_on_my_tabs = {spy_on_my_tabs};


})();
