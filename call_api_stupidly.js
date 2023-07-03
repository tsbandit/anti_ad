(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {storage_set} = Global.util;

const call_api_stupidly = async(request_object) => {
  await chrome.runtime.sendMessage({type: 'call_api_stupidly', request_object});
};

Global.call_api_stupidly = {call_api_stupidly};


})();
