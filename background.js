'use strict';

const defaultLang = 'lang_zh-TW';
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
});

if (navigator.doNotTrack !== 1) { // Let's not be evil, OK?
  chrome.webRequest.onBeforeRequest.addListener(function (details) {
    const url = new URL(details.url);
    url.searchParams.delete(lrParam);
    url.searchParams.append(lrParam, selectedLang);
    // return a BlockingResponse object
    return {
      redirectUrl: url.toString()
    };
  },
    { urls: ['*://www.google.com/search?*'] },
    ['blocking']
  );
}