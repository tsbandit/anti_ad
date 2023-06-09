(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {test_notifications} = Global.test_notifications;

const main = async() => {
  await test_notifications();
};

main();


})();
