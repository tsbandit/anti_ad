// worker.js
self.onmessage = (e) => {
  try {
    const {modules, name} = e.data;
    const keys = Object.keys(modules).sort();
    let assembled_code = '';
    for(const subname of keys) {
      assembled_code += `const ${subname} = (${modules[subname]});`;
    }
    assembled_code += `return ${name}();`
    const fn = new Function(assembled_code);
    const result = fn();
    const result_string = JSON.stringify(result);
    const LIMIT = 3000;
    postMessage({result: {truncated: (result_string.length > LIMIT), result: result_string.slice(0, LIMIT)}});
  } catch(err) {
    console.log('ymmot13');
    postMessage({error: err.stack});
  }
};
