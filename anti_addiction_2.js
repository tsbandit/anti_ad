(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {sleep, make_state, storage_get, storage_set} = Global.util;

const ONE_HOUR_IN_MILLIS = 60 * 60 * 1000;

const safe_JSON_parse = (arg) => {
  try {
    return JSON.parse(arg);
  } catch(e) {
    return undefined;
  }
};

const audioContext = new AudioContext();
function playTone({frequency = 440, duration = 1000, gain: gain_value = 0.5, delay = 0}) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'sawtooth';
  oscillator.frequency.value = frequency;
  gainNode.gain.value = gain_value;

  // Connect oscillator → gain → output
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Start and stop the tone
  oscillator.start(audioContext.currentTime + delay/1000);
  oscillator.stop(audioContext.currentTime + delay/1000 + duration/1000);
}

let last_look_time = 0;

const looking_at_anti_addiction_2_page = () => {
  last_look_time = Date.now();
};

const create_or_focus_window = (() => {
  let most_recent_window_opening = 0;
  return async() => {
    const url = chrome.runtime.getURL("anti_addiction_2.html");

    // Find existing window
    const existing = await new Promise((resolve) => (chrome.windows.getAll({populate: true}, resolve)));
    const target = existing.find((win) => (win.tabs?.some((tab) => (tab.url === url))));

    if(target) {
      chrome.windows.update(target.id, {focused: true});
    } else if(Date.now() - most_recent_window_opening >= 10000) {
      console.log({existing});
      most_recent_window_opening = Date.now();
      chrome.windows.create({url});
    }
  };
})();

const enforce_break = async({break_finishes_at}) => {
  const INITIAL_GAIN = 0.05;
  let gain = INITIAL_GAIN;
  while(Date.now() < break_finishes_at) {
    await sleep(500);

    if(Date.now() < last_look_time + 2500) {
      gain = INITIAL_GAIN;
    } else {
      playTone({delay: 0, duration: 250, gain});
      gain = Math.min(1, gain * 4/3);
      create_or_focus_window();
    }
  }
};

const update_state = (new_state) => {
  storage_set({anti_addiction_2_state: JSON.stringify(new_state)});
  state = new_state;
};
let state = undefined;
const anti_addiction_2 = async() => {
  //state = safe_JSON_parse(await storage_get('anti_addiction_2_state'))  ||  {type: 'v1', base_time: Date.now()};
  state = {type: 'v1', base_time: Date.now() - 2*ONE_HOUR_IN_MILLIS + 30*1000};  // Just for testing
  update_state(state);
  while(true) {
    const time = Date.now() - state.base_time;
    if(time < 0) {
      throw new Error('ma923rp23ivoanbfef');
    } else if(time <= ONE_HOUR_IN_MILLIS) {
      await sleep(ONE_HOUR_IN_MILLIS - time);
    } else if(time <= 2*ONE_HOUR_IN_MILLIS) {
      const break_finishes_at = Date.now() + 2 * ONE_HOUR_IN_MILLIS - time;
      await enforce_break({break_finishes_at});
    } else {
      update_state({...state, base_time: state.base_time + 2*ONE_HOUR_IN_MILLIS});
    }
  }
};

const get_anti_addiction_2_state = () => (state);

Global.anti_addiction_2 = {anti_addiction_2, looking_at_anti_addiction_2_page, get_anti_addiction_2_state};


})();
