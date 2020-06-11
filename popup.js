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
  'ANY_LANG': chrome.i18n.getMessage('any_lang')
};
let buttonContainer = document.getElementById('buttonContainer');

for (let lang of Object.keys(supportLangMap)) {
  let button = document.createElement('button');
  let buttonText = document.createTextNode(supportLangMap[lang]);
  button.setAttribute('id', lang);
  button.appendChild(buttonText);
  button.onclick = onClick;
  buttonContainer.appendChild(button);
}

function onClick(element) {
  let selectedLang = element.target.id;
  chrome.runtime.sendMessage({selected: selectedLang});
  window.close();
}

chrome.storage.sync.get('selected', function(data) {
  let selectedLang = data && data.selected;
  let selectedButton = document.getElementById(selectedLang);
  if (selectedButton) {
    selectedButton.style.backgroundColor = '#a7d47d';
  }
});
