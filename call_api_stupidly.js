(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {storage_set} = Global.util;

const call_api_stupidly = async(request_object) => {
  const result = await chrome.runtime.sendMessage({type: 'call_api_stupidly', request_object});
  return result;
};

Global.call_api_stupidly = {call_api_stupidly};


})();
