const main = async() => {
  const button = document.createElement('button');
  button.addEventListener('click', () => {
    chrome.tabs.create({url: chrome.runtime.getURL("focus_enhancer.html")});
  });
  button.innerText = 'Focus enhancer';
  document.body.appendChild(button);
};

main();
