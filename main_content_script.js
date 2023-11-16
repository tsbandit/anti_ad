(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {register_unhandled_rejection_handler_content, escalate} = Global.util;
const {anti_ad} = Global.anti_ad;
const {spy_on_youtube} = Global.spy_on_youtube;

console.log('main_content_script');

const main = async() => {
  register_unhandled_rejection_handler_content();

  try {
    spy_on_youtube();  // Launch async thread.
    await anti_ad();
  } catch(e) {
    escalate(e);
  }
};

main();


})();
