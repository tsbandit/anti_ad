(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {escalate} = Global.util;
const {spy_on_my_tabs} = Global.spy_on_my_tabs;

const main = async() => {
  window.addEventListener("unhandledrejection", (promise_rejection_event) => {
    console.log('tommy unhandledrejection');
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
