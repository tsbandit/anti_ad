(() => {


const Global = window.Global = window.Global || {};

const sleep = (n) => new Promise((resolve, reject) => {
  setTimeout(resolve, n);
});

Global.util = {sleep};


})();
