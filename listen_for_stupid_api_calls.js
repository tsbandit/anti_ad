(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {call_api} = Global.call_api;

const listen_for_stupid_api_calls = async() => {
  chrome.runtime.onMessage.addListener(async(request, sender, send_response) => {
    try {
      console.log('tommy 1', request);

      if(request.type !== 'call_api_stupidly')
        return;

      await call_api(request.request_object);
    } finally {
      send_response();
    }
  });
};

Global.listen_for_stupid_api_calls = {listen_for_stupid_api_calls};


})();
