(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {register_unhandled_rejection_handler_content, escalate} = Global.util;
const {anti_ad} = Global.anti_ad;
const {spy_on_youtube} = Global.spy_on_youtube;

console.log('main_content_script');

const site_on_anti_ad_site_list = () => {
  if(false
        ||  window.location.hostname.endsWith('7cups.com')
        ||  window.location.hostname.endsWith('google.com')
        ||  window.location.hostname.endsWith('quora.com')
        ||  window.location.hostname.endsWith('youtube.com')
        ||  window.location.hostname.endsWith('x.com')
        ||  window.location.hostname.endsWith('search.brave.com')
        ) {
    return true;
  } else {
    return false;
  }
};

const main = async() => {
  register_unhandled_rejection_handler_content();

  try {
    spy_on_youtube();  // Launch async thread.
    if(site_on_anti_ad_site_list()) {
      await anti_ad();
    } else {
      console.log('anti_ad not enabled on this site');
    }
  } catch(e) {
    escalate(e);
  }
};

main();


})();
