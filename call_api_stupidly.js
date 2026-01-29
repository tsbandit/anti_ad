(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {storage_set} = Global.util;

function showToast({message, duration = 3000, red = false}) {
  // Create toast element
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #333;
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    font-size: 14px;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  if(red)
    toast.style.backgroundColor = '#a00';
  toast.textContent = message;

  // Add to DOM
  document.body.appendChild(toast);

  // Trigger reflow to enable transition
  void toast.offsetWidth;

  // Fade in
  toast.style.opacity = '1';

  // Fade out and remove after duration
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.addEventListener('transitionend', () => toast.remove());
  }, duration);
}

const possibly_render_acknowledgment = ({request_object: req, response_object: resp, errored}) => {
  console.log('possibly_render_acknowledgment() ymmot2');
  if(req.type === 'save arbitrary data' && req.data?.type === 'brave search llm message pair') {
    if(errored)
      showToast({red: true, message: 'Failed to save something'});
    const json_string = JSON.stringify(resp);
    const size = 50;
    const r = Math.floor(Math.random() * Math.max(0, json_string.length - size));
    showToast({message: `Saved ${json_string.length} bytes. Excerpt: ${JSON.stringify(resp).slice(r, r + size)}`});
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

  possibly_render_acknowledgment({request_object, response_object: result, errored});

  if(errored)
    throw error;

  return result;
};

Global.call_api_stupidly = {call_api_stupidly};


})();
