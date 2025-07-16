(() => {


'use strict';

const Global = window.Global = window.Global || {};

//const {storage_get, storage_set, sleep, escalate, make_state} = Global.util;

const TIMEOUT = 5000;

const execute_code = (code) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(chrome.extension.getURL('worker.js'));

    const timer = setTimeout(() => {
      worker.terminate();
      reject(new Error('Code execution timed out'));
    }, TIMEOUT);

    worker.onmessage = function (e) {
      clearTimeout(timer);
      worker.terminate();
      if (e.data.error) {
        reject(e.data.error);
      } else {
        resolve(e.data.result);
      }
    };

    worker.onerror = function (err) {
      clearTimeout(timer);
      worker.terminate();
      reject(err.message || 'Worker error');
    };

    worker.postMessage(code);
  });
};

Global.execute_code = {execute_code};


})();
