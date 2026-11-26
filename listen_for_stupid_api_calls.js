(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {escalate, storage_set, storage_get} = Global.util;
const {call_api} = Global.call_api;
const {get_recent_tabs_data} = Global.recent_tabs_data_state;
const {ai_coding} = Global.execute_code;
const {get_anti_addiction_2_state, looking_at_anti_addiction_2_page} = Global.anti_addiction_2;

const possibly_do_extension_stuff_first = async(request_object) => {
  if(request_object.type === 'youtube') {
    const recent_videos_data = await storage_get('recent_videos_data') || {};
    recent_videos_data[request_object.video_id] = {...request_object, viewing_timestamp: Date.now()};
    storage_set({recent_videos_data});
    const {video_id, video_timestamp} = request_object;
    return {type: 'youtube', video_id, video_timestamp};
  } else {
    // Do nothing

    return request_object;
  }
};

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
          const new_request_object = await possibly_do_extension_stuff_first(request.request_object);
          const response = await call_api(new_request_object);
          send_response(response);
        } else if(request.type === 'youtube page startup') {
          const recent_videos_data = await storage_get('recent_videos_data') || {};
          console.log('ymmot2', {recent_videos_data, request});
          send_response(recent_videos_data[request.video_id]);
        } else if(request.type === 'escalate error') {
          escalate(request.error);
        } else if(request.type === 'ai coding') {
          const response = await ai_coding(request.operation);
          send_response(response);
        } else if(request.type === 'get recent tabs data') {
          send_response(get_recent_tabs_data());
        } else if(request.type === 'get_anti_addiction_2_state') {
          send_response(get_anti_addiction_2_state());
        } else if(request.type === 'looking_at_anti_addiction_2_page') {
          looking_at_anti_addiction_2_page();
        } else if(request.type === 'heartbeat') {
          // Do nothing
        } else {
          throw new Error('unrecognized extension message type: ' + request.type);
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
