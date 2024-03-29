'use strict';

const defaultLang = 'ANY_LANG';
const lrParam = 'lr';
let selectedLang = defaultLang;

chrome.runtime.onInstalled.addListener(function () {
  // set default lang
  chrome.storage.sync.set({ selected: defaultLang });
});

chrome.runtime.onMessage.addListener(function(request) {
  // update lang from popup
  selectedLang = request.selected;
  chrome.storage.sync.set({ selected: selectedLang });
  if (request.redirect) {
    chrome.tabs.reload();
  }
});

chrome.storage.sync.get('selected', function (data) {
  selectedLang = data && data.selected;
});

if (navigator.doNotTrack !== 1) { // Let's not be evil, OK?
  chrome.webRequest.onBeforeRequest.addListener(function (details) {
    const url = new URL(details.url);
    url.searchParams.delete(lrParam);
    if (selectedLang !== 'ANY_LANG') {
      url.searchParams.append(lrParam, selectedLang);
    }
    // return a BlockingResponse object
    return {
      redirectUrl: url.toString()
    };
  },
    { urls: ['*://www.google.com/search?*'] },
    ['blocking']
  );
}