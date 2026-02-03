(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {sleep, make_state} = Global.util;

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

const anti_addiction_2 = async() => {
  playTone({delay:    0, duration: 425, gain: 0.178});
  playTone({delay:  500, duration: 258, gain: 0.237});
  playTone({delay:  833, duration:  92, gain: 0.316});
  playTone({delay: 1000, duration:  92, gain: 0.422});
  playTone({delay: 1167, duration: 425, gain: 0.563});
  playTone({delay: 1667, duration: 258, gain: 0.750});
  playTone({delay: 2000, duration: 425, gain: 1.000});
};

Global.anti_addiction_2 = {anti_addiction_2};


})();
