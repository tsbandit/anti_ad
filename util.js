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

  return new Promise((resolve) => {
    chrome.notifications.create(unique_id, {
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

const escalate = (error) => {
  console.log('escalate(): current timestamp', new Date().toString());
  console.error(error);
  possibly_send_notification();
};

const onload_promise = new Promise((resolve) => (window.addEventListener('load', resolve)));

Global.util = {sleep, make_state, possibly_send_notification, storage_get, storage_set, escalate, onload_promise};


})();
