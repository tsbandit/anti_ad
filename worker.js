// worker.js
self.onmessage = function (e) {
  const code = e.data;
  const sandbox = {};
  try {
    const fn = new Function('sandbox', code);
    const result = fn(sandbox);
    postMessage({result});
  } catch (err) {
    postMessage({error: err.message});
  }
};
