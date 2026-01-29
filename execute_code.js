(() => {


'use strict';

const Global = window.Global = window.Global || {};

//const {storage_get, storage_set, sleep, escalate, make_state} = Global.util;

const TIMEOUT = 5000;

const execute_code = ({modules, name}) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(chrome.extension.getURL('worker.js'));

    const timer = setTimeout(() => {
      worker.terminate();
      resolve({error: 'Code execution timed out (TIMEOUT = ' + TIMEOUT + ' ms)'});
    }, TIMEOUT);

    worker.onmessage = function (e) {
      clearTimeout(timer);
      worker.terminate();
      if(e.data.error) {
        resolve(e.data);
      } else {
        resolve(e.data);
      }
    };

    worker.onerror = function (err) {
      clearTimeout(timer);
      worker.terminate();
      resolve({error: err.message || 'Worker error'});
    };

    worker.postMessage({modules, name});
  });
};

const call_ai_coding_api = async(req_obj) => {
  return await (await fetch('http://localhost:3011/api', {
    method: 'post',
    body: JSON.stringify(req_obj),
    headers: {'Content-Type': 'application/json'},
  })).json();
};

const ai_coding = async(operation) => {
  if(operation.type === 'ai coding execute code') {
    const {modules} = await call_ai_coding_api({type: 'get modules'});
    return await execute_code({...operation, modules});
  } else if(operation.type === 'ai coding get module') {
    return await call_ai_coding_api({...operation, type: 'get module'});
  } else if(operation.type === 'ai coding get modules') {
    return Object.keys((await call_ai_coding_api({...operation, type: 'get modules'})).modules);
  } else if(operation.type === 'ai coding put module') {
    return await call_ai_coding_api({...operation, type: 'put module'});
  } else {
    throw 'amk09ew23093v';
  }
};

Global.execute_code = {ai_coding};


})();
