(() => {


const Global = window.Global = window.Global || {};

const sleep = (n) => new Promise((resolve, reject) => {
  setTimeout(resolve, n);
});

const make_state = (initial_value) => {
  if(typeof initial_value === 'function')
    throw new Error('initial_value should not be a function');

  let state = initial_value;
  const get_state = () => {
    return state;
  };
  const set_state = (arg) => {
    if(typeof arg === 'function') {
      state = arg(state);
    } else {
      state = arg;
    }
  };
  return [get_state, set_state];
};

const storage_get = (key) => (new Promise((resolve) => {chrome.storage.local.get(key, (r) => {resolve(r[key]);});}));

const storage_set = (obj) => (new Promise((resolve) => {chrome.storage.local.set(obj, resolve);}));

const create_notification = ({unique_id, ...options}) => {
  if(unique_id === undefined)
    throw new Error('unique_id is undefined');

  if(options.message === undefined)
    throw new Error('message is undefined');

  const f = chrome.notifications.create;

  if(f === undefined)
    throw new Error('chrome.notifications.create not supported');

  return new Promise((resolve) => {
    f(unique_id, {
      type: 'basic',
      title: 'Alert',
      iconUrl: 'x.png',
      ...options,
    }, resolve);
  });
};

const possibly_send_notification = async() => {
  const last_notification_time = await (async() => {
    const x = await storage_get('last_notification_time');
    if(typeof x !== 'number') {
      return -1;
    } else {
      return x;
    }
  })();

  const now = Date.now();
  const twenty_minutes = 20 * 60 * 1000;
  const one_minute = 60 * 1000;
  if(now > last_notification_time + twenty_minutes) {
    new Audio('notification.ogg').play();
    console.trace('alert!', new Date().toString());
    await create_notification({unique_id: '16tXkuE25GlySnO1HCfj', message: 'alert!'});
    await storage_set({last_notification_time: now});
  } else {
    // Do nothing
  }
};

const escalate = async(error) => {
  console.log('escalate(): current timestamp', new Date().toString());
  console.error(error);
  await possibly_send_notification();
};

const onload_promise = new Promise((resolve) => (window.addEventListener('load', resolve)));

const register_unhandled_rejection_handler_background = () => {
  const handle_unhandled_rejection = (
    async(promise_rejection_event) => {
      try {
        console.log('tommy unhandledrejection');
        await escalate(promise_rejection_event.reason);
      } catch(e) {
        console.error('tommy already handling; ' + e.message);
        console.log('errors were', promise_rejection_event, e);
      }
    }
  );
  window.addEventListener("unhandledrejection", handle_unhandled_rejection);
};

const register_unhandled_rejection_handler_content = () => {
  const handle_unhandled_rejection = (
    async(promise_rejection_event) => {
      try {
        console.log('tommy unhandledrejection; ' + promise_rejection_event.reason);
        await chrome.runtime.sendMessage({type: 'escalate error', error: promise_rejection_event.reason});
      } catch(e) {
        console.error('tommy already handling; ' + e.message);
        console.log('errors were', promise_rejection_event, e);
      }
    }
  );
  window.addEventListener("unhandledrejection", handle_unhandled_rejection);
};

const chrome_runtime_sendMessage = (request_object) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(request_object, (response) => {resolve(response);});
  });
};

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

Global.util = {sleep, make_state, possibly_send_notification, storage_get, storage_set, escalate, onload_promise, register_unhandled_rejection_handler_background, register_unhandled_rejection_handler_content, showToast, chrome_runtime_sendMessage};


})();
