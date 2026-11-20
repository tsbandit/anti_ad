(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {showToast} = Global.util;

const possibly_render_acknowledgment = ({request_object: req, response_object: resp, errored, error}) => {
  if(req.type === 'save arbitrary data' && (
            req.data?.type === 'brave search llm message pair'
        ||  req.data?.type === 'grok message'
        )) {
    if(errored) {
      showToast({red: true, message: 'Failed to save something'});
      console.log(error);
      return 'suppress error';
    } else {
      const json_string = JSON.stringify(resp);
      const size = 50;
      const r = Math.floor(Math.random() * Math.max(0, json_string.length - size));
      showToast({message: `Saved ${json_string.length} bytes. Excerpt: ${JSON.stringify(resp).slice(r, r + size)}`});
    }
  } else if(req.type === 'youtube') {
    if(errored) {
      showToast({red: true, message: 'Failed to save something'});
      console.log(error);
      return 'suppress error';
    } else {
      // Do nothing
    }
  }
};

const chrome_runtime_sendMessage = (request_object) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(request_object, (response) => {resolve(response);});
  });
};

const call_api_stupidly = async(request_object) => {
  let errored = false;
  let error = undefined;
  const result = await (async() => {
    try {
      return await chrome_runtime_sendMessage({type: 'call_api_stupidly', request_object});
    } catch(e) {
      errored = true;
      error = e;
    }
  })();

  const ret = possibly_render_acknowledgment({request_object, response_object: result, errored, error});

  if(errored && ret !== 'suppress error')
    throw error;

  return result;
};

Global.call_api_stupidly = {call_api_stupidly};


})();
