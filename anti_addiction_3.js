const ONE_HOUR_IN_MILLIS = 60 * 60 * 1000;

let div;
let window_has_focus = () => (false);
window.addEventListener('load', () => {
  div = document.querySelector('div');

  const textarea = document.querySelector('textarea');
  let textarea_has_focus = false;
  window.addEventListener('blur', () => {textarea.focus();});
  textarea.addEventListener('focus', () => {textarea_has_focus = true;});
  textarea.addEventListener('blur', () => {textarea_has_focus = false;});
  window_has_focus = () => (document.hasFocus() && !textarea_has_focus);
});

const chrome_runtime_sendMessage = (request_object) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(request_object, (response) => {resolve(response);});
  });
};

const calculate_minutes_seconds = (time_til) => {
  const minutes = (time_til - (time_til % (60*1000))) / (60*1000);
  return {minutes, seconds: ((time_til - minutes*60*1000) - (time_til % 1000))/1000};
};

let base_time = 0;

setInterval(async() => {
  if(window_has_focus())
    chrome.runtime.sendMessage({type: 'looking_at_anti_addiction_2_page'});

  const now = Date.now();
  const my_time = now - base_time;

  if(my_time < ONE_HOUR_IN_MILLIS) {
    const break_start = now - my_time + ONE_HOUR_IN_MILLIS;
    const time_til = break_start - now;
    const {minutes, seconds} = calculate_minutes_seconds(time_til);
    div.innerText = `Break STARTS in ${minutes}m and ${seconds}s\n\nat ${new Date(break_start)}`;
  } else {
    const now = Date.now();
    const break_end = now - my_time + 2*ONE_HOUR_IN_MILLIS;
    const time_til = break_end - now;
    const {minutes, seconds} = calculate_minutes_seconds(time_til);
    div.innerText = `Break ENDS in ${minutes}m and ${seconds}s\n\nat ${new Date(break_end)}`;
  }
}, 1000);

const query_the_state = async() => {
  const state = await chrome_runtime_sendMessage({type: 'get_anti_addiction_2_state'});
  if(state.type === 'v1') {
    base_time = state.base_time;
  } else {
    throw new Error('mziboe0w929821901mb');
  }
};
setInterval(query_the_state, 60*1000);
query_the_state();
