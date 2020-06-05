// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const defaultLang = 'lang_zh-TW';
const lrParam = 'lr';
let selectedLang = defaultLang;

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ selected: defaultLang });
});

chrome.runtime.onMessage.addListener(function(request) {
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
    { urls: ['*://www.google.com/search?*glr_id'] },
    ['blocking']
  );
}