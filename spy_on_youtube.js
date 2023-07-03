(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {onload_promise} = Global.util;

const determine_if_this_is_youtube = () => {
  return (
        window.location.href.startsWith('https://www.youtube.com/embed/')
    ||  window.location.href.startsWith('https://www.youtube.com/watch?')
  );
};

const spy_on_youtube = async() => {
  console.log('called spy_on_youtube()');

  if(!determine_if_this_is_youtube()) {
    // Do nothing
  } else {
    await onload_promise;

    console.log(document.querySelectorAll('video'));
  }
};

Global.spy_on_youtube = {spy_on_youtube};


})();
