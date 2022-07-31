chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // read changes of url and send the new url to content scripts.js
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, {
      message: "hello!",
      url: changeInfo.url,
    });
  }
});
