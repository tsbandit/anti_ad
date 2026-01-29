(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {storage_set} = Global.util;

const showToast = (() => {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    width: 300px;
  `;
  document.body.appendChild(container);

  const toasts = [];

  const updatePositions = () => {
    let offset = 0;
    toasts.forEach(toastObj => {
      const offset_2 = offset;
      requestAnimationFrame(() => {
        toastObj.element.style.transform = `translateY(-${offset_2}px)`;
      });
      offset += toastObj.height + 10; // 10px gap
    });
  };

  return ({ message, duration = 5000, red = false }) => {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: absolute;
      bottom: 0;
      right: 0;
      width: 100%;
      background-color: ${red ? '#a00' : '#333'};
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      font-size: 14px;
      opacity: 0;
      transition: opacity 0.3s ease, transform 0.3s ease;
    `;
    toast.textContent = message;

    container.appendChild(toast);

    // Measure height after append
    const height = toast.offsetHeight;
    const toastObj = { element: toast, height };

    // Insert at start of array (top of stack)
    toasts.unshift(toastObj);

    // Trigger reflow and animate in
    void toast.offsetWidth;
    toast.style.opacity = '1';

    updatePositions(); // Animate all into correct positions

    // Auto-remove
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.addEventListener('transitionend', () => {
        toast.remove();
        toasts.splice(toasts.indexOf(toastObj), 1);
        updatePositions(); // Re-animate stack
      });
    }, duration);
  };
})();

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
