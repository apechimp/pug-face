chrome.browserAction.onClicked.addListener(function(tab) {
// No tabs or host permissions needed!
console.log('Turning ' + tab.url + ' pugs!');
chrome.tabs.executeScript({
    file: 'bundle.js'
  });
});
