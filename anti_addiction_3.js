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
  textarea.focus();
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

let the_status = 'blocked';
let deadline = 0;

setInterval(async() => {
  if(window_has_focus())
    chrome.runtime.sendMessage({type: 'looking_at_anti_addiction_2_page'});

  const now = Date.now();

  if(the_status === 'available') {
    const break_start = deadline;
    const time_til = break_start - now;
    const {minutes, seconds} = calculate_minutes_seconds(time_til);
    div.innerText = `Break STARTS in ${minutes}m and ${seconds}s\n\nat ${new Date(break_start)}`;
  } else if(the_status === 'blocked') {
    const now = Date.now();
    const break_end = deadline;
    const time_til = break_end - now;
    const {minutes, seconds} = calculate_minutes_seconds(time_til);
    div.innerText = `Break ENDS in ${minutes}m and ${seconds}s\n\nat ${new Date(break_end)}`;
  } else {
    throw new Error('maf93b32i9wmv298m991fej');
  }
}, 1000);

const query_the_state = async() => {
  const state = await chrome_runtime_sendMessage({type: 'get_anti_addiction_2_state'});
  if(state.type === 'v1') {
    throw new Error('mziboe0am2309w929821901mb');
  } else if(state.version === 2) {
    the_status = state.the_status;
    deadline = state.deadline;
  } else {
    throw new Error('mziboe0w929821901mb');
  }
};
setInterval(query_the_state, 60*1000);
query_the_state();
