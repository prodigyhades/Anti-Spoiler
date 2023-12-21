chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if(changeInfo.status == 'complete'){
      chrome.scripting.executeScript({
        files: ['script.js'],
        target: {tabId: tab.id}
      })
    }
  });

  /*The ServiceWorker.js script is acting as a background script that listens for tab updates using the chrome.tabs.onUpdated event. 
  When a tab is updated (e.g., when the page finishes loading), it executes the script.js content script in the updated tab using 
  the chrome.scripting.executeScript method.*/