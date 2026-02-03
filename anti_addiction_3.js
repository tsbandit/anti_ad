const chrome_runtime_sendMessage = (request_object) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(request_object, (response) => {resolve(response);});
  });
};

setInterval(() => {
  if(!document.hidden)
    chrome.runtime.sendMessage({type: 'looking_at_anti_addiction_2_page'});
}, 1000);
