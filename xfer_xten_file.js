(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {storage_get, chrome_runtime_sendMessage} = Global.util;

const unique_event_id = 'intercepted_data_BJxCzQv6Rn0wW5PwstYO';    // Keep this in sync with the line below ...

const to_be_injected = () => {
  const unique_event_id = 'intercepted_data_BJxCzQv6Rn0wW5PwstYO';  // Keep this in sync with the line above.

  const unique_id_xfer_xten_file = 'xfer_xten_file__ZV8lK6rpR3dI8Ul3s73E';

  const safe_JSON_parse = (arg) => {
    try {
      return JSON.parse(arg);
    } catch(e) {
      return undefined;
    }
  };
  const replace_the_functions = () => {
    window[unique_id_xfer_xten_file] = {
      get_recent_videos_data: () => {
        return new Promise((resolve, reject) => {
          const event_id = Math.random()+''+Math.random();
          const listener = async(ev) => {
            document.removeEventListener(event_id, listener);
            resolve(ev.detail.result);
          };
          document.addEventListener(event_id, listener);
          document.dispatchEvent(new CustomEvent(unique_event_id, {detail: {type: 'get recent videos data', event_id}}));
        });
      },
      get_recent_tabs_data: () => {
        return new Promise((resolve, reject) => {
          const event_id = Math.random()+''+Math.random();
          const listener = async(ev) => {
            document.removeEventListener(event_id, listener);
            resolve(ev.detail.result);
          };
          document.addEventListener(event_id, listener);
          document.dispatchEvent(new CustomEvent(unique_event_id, {detail: {type: 'get recent tabs data', event_id}}));
        });
      },
    };
  };

  replace_the_functions();
};

const get_recent_tabs_data = async() => {
  return await chrome_runtime_sendMessage({type: 'get recent tabs data'});
};

const get_recent_videos_data = async() => {
  return await storage_get('recent_videos_data');
};

const do_the_instrumentation = () => {
  const script_tag = document.createElement('script');
  script_tag.textContent = '(' + to_be_injected + ')();';
  script_tag.onload = function() {this.remove();};
  document.head.appendChild(script_tag);

  document.addEventListener(unique_event_id, async(ev) => {
    //console.log('tommy5', ev.detail);
    if(ev.detail.type === 'get recent videos data') {
      const {event_id} = ev.detail;
      const videos_data = await get_recent_videos_data();
      document.dispatchEvent(new CustomEvent(event_id, {detail: {result: videos_data}}));
    } else if(ev.detail.type === 'get recent tabs data') {
      const {event_id} = ev.detail;
      const tabs_data = await get_recent_tabs_data();
      document.dispatchEvent(new CustomEvent(event_id, {detail: {result: tabs_data}}));
    } else {
      throw new Error('unrecognized type');
    }
  });
};

if(window.location.href === 'file:///C:/Users/Tommy/Documents/aaa_tommy/projects/rss_aggregator/main.html') {
  do_the_instrumentation();
}


})();
