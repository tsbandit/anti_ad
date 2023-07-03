(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {escalate} = Global.util;
const {anti_ad} = Global.anti_ad;
const {spy_on_youtube} = Global.spy_on_youtube;

console.log('main_content_script');

const main = async() => {
  window.addEventListener("unhandledrejection", (promise_rejection_event) => {
    console.log('tommy unhandledrejection');
    escalate(promise_rejection_event.reason);
  });

  try {
    spy_on_youtube();  // Launch async thread.
    await anti_ad();
  } catch(e) {
    escalate(e);
  }
};

main();


})();
