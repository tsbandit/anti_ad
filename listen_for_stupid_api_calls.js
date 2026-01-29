(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {escalate} = Global.util;
const {call_api} = Global.call_api;
const {ai_coding} = Global.execute_code;

const listen_for_stupid_api_calls = async() => {
  chrome.runtime.onMessage.addListener((request, sender, send_response_) => {
    console.log('tommy8', chrome.runtime.lastError);
    (async() => {
      const send_response = (() => {
        let called_already = false;
        return (x) => {
          if(!called_already) {
            called_already = true;
            console.log('ymmot4', x);
            send_response_(x);
          } else {
            console.log('ymmot1');
          }
        };
      })();
      try {
        console.log('tommy 1', request);

        if(request.type === 'call_api_stupidly') {
          const response = await call_api(request.request_object);
          console.log('ymmot3', response);
          send_response(response);
        } else if(request.type === 'escalate error') {
          escalate(request.error);
        } else if(request.type === 'ai coding') {
          const response = await ai_coding(request.operation);
          send_response(response);
        }
      } finally {
        console.log('tommy9', chrome.runtime.lastError);
        send_response();
      }
    })();
    console.log('ymmot5');
    return true;
  });
};

Global.listen_for_stupid_api_calls = {listen_for_stupid_api_calls};


})();
