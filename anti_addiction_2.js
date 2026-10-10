(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {sleep, make_state, storage_get, storage_set} = Global.util;

const ONE_MINUTE_IN_MILLIS = 60 * 1000;
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

const make_state_machine = async() => {
  const INITIAL_STATE = {version: 2, type: 'blocked', budget: 3*ONE_HOUR_IN_MILLIS, last_update: Date.now(), counter: 0, deadline: Date.now() + 30*1000};  // Just for testing

  let state = safe_JSON_parse(await storage_get('anti_addiction_2_state'))  ||  INITIAL_STATE;
  //let state = INITIAL_STATE;  // Just for testing

  const update_state = (new_state) => {
    storage_set({anti_addiction_2_state: JSON.stringify(new_state)});
    state = new_state;
  };

  let timeoutId = null;

  function compute(now) {
    const new_state = {...state};
    new_state.last_update = now;

    // Reset budget if midnight passed
    const today = new Date(now).setHours(0, 0, 0, 0);
    if(state.last_update < today)
      new_state.budget = 3*ONE_HOUR_IN_MILLIS;

    // Update counter
    const rate = ((state.type === 'blocked') ? -11 : 1);
    new_state.counter = Math.max(-30, state.counter + rate * (now - state.last_update));

    if(state.type === "available" && now >= state.deadline) {
      // Transition to B
      new_state.type = "blocked";
      new_state.deadline = now + 10 * ONE_MINUTE_IN_MILLIS;
    } else if(state.type === "blocked" && now >= state.deadline) {
      new_state.type = 'available';
      if(state.counter > 0) {
        new_state.d = now + 50 * ONE_MINUTE_IN_MILLIS;
      } else {
        new_state.deadline = now + 110 * ONE_MINUTE_IN_MILLIS;
      }
    }

    return new_state;
  }

  function is_within_special_window(now = Date.now()) {
    const h = new Date(now).getHours();
    const m = new Date(now).getMinutes();
    return (h >= 21 && m >= 45) || h < 5;
  }

  function start_timer() {
    if(timeoutId)
      clearTimeout(timeoutId);
    timeoutId = null;
    function run() {
      update_state(compute(Date.now()));
      const delay = Math.max(1000, state.deadline - Date.now());
      timeoutId = setTimeout(run, delay);
    }
    run();
  }
  const restart_timer = start_timer;

  function override(now = Date.now()) {
    if(state.type === "blocked" && state.budget > 0) {
      update_state(compute(now));
      const extendSec = Math.min(30 * ONE_MINUTE_IN_MILLIS, state.budget);
      state.type = "available";
      state.deadline = now + extendSec * 1000;
      state.budget -= extendSec;
      update_state(state);
      restart_timer();
    }
  }

  function elective_break(now = Date.now()) {
    update_state(compute(now));
    state.type = "blocked";
    state.deadline = now + 10 * ONE_MINUTE_IN_MILLIS;
    update_state(state);
    restart_timer();
  }

  function get_status() {
    if(is_within_special_window())
      return 'blocked';
    return state.type;
  }

  function get_state() {return state;}

  return {start_timer, override, elective_break, get_status, get_state};
};

let my_state_machine;
make_state_machine().then((x) => {my_state_machine = x;});

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

//const enforce_break = async({break_finishes_at}) => {
//  const INITIAL_GAIN = 0.05;
//  let gain = INITIAL_GAIN;
//  while(Date.now() < break_finishes_at) {
//    await sleep(500);
//
//    if(Date.now() < last_look_time + 2500) {
//      gain = INITIAL_GAIN;
//    } else {
//      playTone({delay: 0, duration: 250, gain});
//      gain = Math.min(1, gain * 4/3);
//      create_or_focus_window();
//    }
//  }
//};

//const isSleepTime = (time) => {
//  const date = new Date(time);
//  const hours = date.getHours();
//  const minutes = date.getMinutes();
//  const totalMinutes = hours * 60 + minutes;
//  const startSleep = 21 * 60 + 45; // 9:45 PM
//  const endSleep = 5 * 60;         // 5:00 AM
//  return totalMinutes >= startSleep || totalMinutes < endSleep;
//};
//const nextMorningTime = (now) => {
//  const tomorrow = new Date(now);
//  tomorrow.setHours(tomorrow.getHours() + 7);
//  tomorrow.setHours(5, 0, 0, 0); // 5:00 AM
//  return tomorrow.getTime();
//};
//const nextMidnight = (now) => {
//  const m = new Date(now);
//  m.setHours(24, 0, 0, 0);
//  return m.getTime();
//};
//
//const update_state = (new_state) => {
//  storage_set({anti_addiction_2_state: JSON.stringify(new_state)});
//  state = new_state;
//};
//let state = undefined;
//
//const run_midnight_thread = async() => {
//  let next_reset = nextMidnight(Date.now());
//  while(true) {
//    await sleep(next_reset - Date.now());
//
//    if(Date.now() >= next_reset) {
//      next_reset += 864e5;
//      update_state({...state, budget: 3*ONE_HOUR_IN_MILLIS});
//    }
//  }
//};
//
//const anti_addiction_2 = async() => {
//  //throw new Error('not implemented right now');
//
//  run_midnight_thread();  // Note: no "await"
//
//  //state = safe_JSON_parse(await storage_get('anti_addiction_2_state'))  ||  {type: 'v1', base_time: Date.now()};
//  state = {version: 2, type: 'blocked', budget: 3*ONE_HOUR_IN_MILLIS, last_update: Date.now(), counter: 0, deadline: Date.now() + 30*1000};  // Just for testing
//  update_state(state);
//  while(true) {
//    await sleep(250);  // Minimum sleep time between loop iterations. For safety.
//
//    const now = Date.now();
//
//    if(isSleepTime(now)) {
//      await enforce_break({break_finishes_at: nextMorningTime(now)});
//      continue;
//    }
//
//    const time = now - state.base_time;
//    if(time < 0) {
//      throw new Error('ma923rp23ivoanbfef');
//    } else if(time <= 11/6 * ONE_HOUR_IN_MILLIS) {
//      await sleep(11/6 * ONE_HOUR_IN_MILLIS - time);
//    } else if(time <= 2*ONE_HOUR_IN_MILLIS) {
//      const break_finishes_at = now + 2 * ONE_HOUR_IN_MILLIS - time;
//      await enforce_break({break_finishes_at});
//    } else {
//      update_state({...state, base_time: state.base_time + 2*ONE_HOUR_IN_MILLIS});
//    }
//  }
//};
//
//const get_anti_addiction_2_state = () => (state);

const anti_addiction_2 = async() => {
  throw new Error('not implemented right now');

  const INITIAL_GAIN = 0.02;
  let gain = INITIAL_GAIN;

  my_state_machine.start_timer();

  while(true) {
    await sleep(500);

    const now = Date.now();

    const the_status = my_state_machine.get_status();

    if(the_status !== 'blocked')
      gain = INITIAL_GAIN;

    if(the_status === 'blocked') {
      if(Date.now() < last_look_time + 2500) {
        gain = INITIAL_GAIN;
      } else {
        playTone({delay: 0, duration: 250, gain});
        gain = Math.min(1, gain * 4/3);
        create_or_focus_window();
      }
    } else if(the_status === 'available') {
      // Do nothing
    } else {
      throw new Error('oaknwdmfcav9084903');
    }
  }
};

const get_anti_addiction_2_state = () => ({...my_state_machine.get_state(), the_status: my_state_machine.get_status()});

Global.anti_addiction_2 = {anti_addiction_2, looking_at_anti_addiction_2_page, get_anti_addiction_2_state};


})();
