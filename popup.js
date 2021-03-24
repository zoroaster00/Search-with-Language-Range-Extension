'use strict';

// branah unicode-converter
const supportLangMap = {
  'lang_zh-TW': '\u6b63\u9ad4\u4e2d\u6587',
  'lang_en': 'English',
  'lang_ja': '\u65e5\u672c\u8a9e',
  'lang_fr': '\u0046\u0072\u0061\u006e\u00e7\u0061\u0069\u0073',
  'lang_de': '\u0044\u0065\u0075\u0074\u0073\u0063\u0068',
  'lang_es': '\u0045\u0073\u0070\u0061\u00f1\u006f\u006c',
  'lang_ru': '\u0420\u0443\u0441\u0441\u043a\u0438\u0439',
  'lang_ko': '\ud55c\uad6d\uc5b4',
  'lang_zh-CN': '\u7b80\u4f53\u4e2d\u6587',
  'lang_it': '\u0049\u0074\u0061\u006c\u0069\u0061\u006e\u006f',
  'lang_hi': '\u0939\u093f\u0928\u094d\u0926\u0940',
  'lang_ar': '\u0627\u0644\u0639\u0631\u0628\u064a\u0629',
  'lang_tr': '\u0054\u00fc\u0072\u006b\u00e7\u0065',
  'lang_pt': '\u0050\u006f\u0072\u0074\u0075\u0067\u0075\u00ea\u0073',
  'lang_id': '\u0042\u0061\u0068\u0061\u0073\u0061 \u0049\u006e\u0064\u006f\u006e\u0065\u0073\u0069\u0061',
  'lang_vi': '\u0054\u0069\u1ebf\u006e\u0067 \u0056\u0069\u1ec7\u0074',
  'lang_th': '\u0e44\u0e17\u0e22',
  'ANY_LANG': chrome.i18n.getMessage('any_lang')
};
const defaultLangList = [
  'lang_zh-TW', 'lang_en', 'lang_ja', 'lang_fr', 'lang_de', 'lang_es',
  'lang_ru', 'lang_ko'];
const moreLangList = [
  'lang_zh-CN', 'lang_it', 'lang_hi', 'lang_ar', 'lang_tr', 'lang_pt',
  'lang_id', 'lang_vi', 'lang_th'];

let selectedLang;
let moreLangAnchor = document.getElementById('moreLang');
moreLangAnchor.onclick = onMoreClick;
moreLangAnchor.innerHTML = chrome.i18n.getMessage('more_selection');

populateLangButtons(document.getElementById('defaultLangContainer'), defaultLangList);
populateLangButtons(document.getElementById('anyLangContainer'), ['ANY_LANG']);

function populateLangButtons(buttonsContainer, langList) {
  for (let lang of langList) {
    let button = document.createElement('button');
    let buttonText = document.createTextNode(supportLangMap[lang]);
    button.setAttribute('id', lang);
    button.appendChild(buttonText);
    button.onclick = onClick;
    buttonsContainer.appendChild(button);
  }
}

function onClick(element) {
  let selectedLang = element.target.id;
  chrome.runtime.sendMessage({ selected: selectedLang, redirect: true });
  window.close();
}

function onMoreClick(element) {
  populateLangButtons(
    document.getElementById('moreLangContainer'),
    moreLangList.filter(lang => lang !== selectedLang));
  element.target.style.display = 'none';
  return false;
}

chrome.storage.sync.get('selected', function (data) {
  selectedLang = data && data.selected;
  let selectedButton = document.getElementById(selectedLang);
  if (selectedButton) {
    // remove if any, re-create it at the top container
    selectedButton.remove();
  }
  populateLangButtons(document.getElementById('selectedLangContainer'), [selectedLang]);
  selectedButton = document.getElementById(selectedLang);
  selectedButton.style.backgroundColor = '#a7d47d';
});
