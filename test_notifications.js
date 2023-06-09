(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {sleep, possibly_send_notification} = Global.util;

const test_notifications = async() => {
  while(true) {
    possibly_send_notification();
    await sleep(21000);
  }
};

Global.test_notifications = {test_notifications};


})();
