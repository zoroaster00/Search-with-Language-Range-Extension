"use strict";

const defaultLang = "ANY_LANG";
const lrParam = "lr";

// Setup default language on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ selected: defaultLang });
  // Initialize rules for default language
  updateLanguageRule(defaultLang);
});

// Listen for messages from popup.html to update language
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const selectedLang = request.selected || defaultLang;
  chrome.storage.sync.set({ selected: selectedLang });
  await updateLanguageRule(selectedLang);
  if (request.redirect) {
    chrome.tabs.reload();
  }
  sendResponse({ status: "updated" });
});

// On startup, restore selected language and update DNR rules
chrome.storage.sync.get("selected", (data) => {
  const selectedLang = data && data.selected ? data.selected : defaultLang;
  updateLanguageRule(selectedLang);
});

// Update the DNR rules for Google Search
function updateLanguageRule(selected) {
  const removeRuleIds = [1]; // Always removing previous language rule

  let addRules = [];
  addRules.push({
    id: 1,
    priority: 1,
    action: {
      type: "redirect",
      redirect: {
        transform: {
          queryTransform:
            selected === defaultLang
              ? { removeParams: [lrParam] }
              : {
                  addOrReplaceParams: [{ key: lrParam, value: selected }],
                },
        },
      },
    },
    condition: {
      urlFilter: "www.google.com/search?",
      resourceTypes: ["main_frame"],
    },
  });

  return chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds,
    addRules,
  });
}
