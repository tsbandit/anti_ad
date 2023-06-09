(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {possibly_send_notification} = Global.util;
const {spy_on_my_tabs} = Global.spy_on_my_tabs;

const escalate = (error) => {
  console.log('current timestamp', new Date().toString());
  console.error(error);
  possibly_send_notification();
};

const main = async() => {
  window.addEventListener("unhandledrejection", (promise_rejection_event) => {
    escalate(promise_rejection_event.reason);
  });

  try {
    await spy_on_my_tabs();
  } catch(e) {
    escalate(e);
  }
};

main();


})();
