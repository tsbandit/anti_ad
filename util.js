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

Global.util = {sleep, make_state};


})();
