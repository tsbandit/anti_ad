(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {escalate} = Global.util;
const {listen_for_stupid_api_calls} = Global.listen_for_stupid_api_calls;
const {spy_on_my_tabs} = Global.spy_on_my_tabs;

const main = async() => {
  window.addEventListener("unhandledrejection", (promise_rejection_event) => {
    console.log('tommy unhandledrejection');
    escalate(promise_rejection_event.reason);
  });

  try {
    listen_for_stupid_api_calls();  // Launches an asynchronous thread.
    await spy_on_my_tabs();
  } catch(e) {
    escalate(e);
  }
};

main();


})();
