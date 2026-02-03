(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {escalate} = Global.util;
const {call_api} = Global.call_api;
const {ai_coding} = Global.execute_code;
const {get_anti_addiction_2_state, looking_at_anti_addiction_2_page} = Global.anti_addiction_2;

const listen_for_stupid_api_calls = async() => {
  chrome.runtime.onMessage.addListener((request, sender, send_response_) => {
    (async() => {
      const send_response = (() => {
        let called_already = false;
        return (x) => {
          if(!called_already) {
            called_already = true;
            send_response_(x);
          }
        };
      })();
      try {
        if(request.type === 'call_api_stupidly') {
          const response = await call_api(request.request_object);
          send_response(response);
        } else if(request.type === 'escalate error') {
          escalate(request.error);
        } else if(request.type === 'ai coding') {
          const response = await ai_coding(request.operation);
          send_response(response);
        } else if(request.type === 'get_anti_addiction_2_state') {
          send_response(get_anti_addiction_2_state());
        } else if(request.type === 'looking_at_anti_addiction_2_page') {
          looking_at_anti_addiction_2_page();
        }
      } finally {
        //console.log('tommy9', chrome.runtime.lastError);
        send_response();
      }
    })();
    return true;
  });
};

Global.listen_for_stupid_api_calls = {listen_for_stupid_api_calls};


})();
