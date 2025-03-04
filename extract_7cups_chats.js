(() => {


'use strict';

const Global = window.Global = window.Global || {};

// const {sleep, make_state} = Global.util;

const sample = async() => {
  chrome.webRequest.onCompleted.addListener(({url}) => {
  }, ???, ???);
};

Global.extract_7cups_chats = {sample};


})();
