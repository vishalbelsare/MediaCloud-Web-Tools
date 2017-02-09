
export const TEMP = 'TEMP';

export const WORD_CLOUD_DOM_ID = 'word-cloud';

export function domElementToSvgString(domId) {
  const elem = document.getElementById(domId);
  elem.setAttribute('title', domId);
  elem.setAttribute('version', 1.1);
  elem.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const html = elem.parentNode.innerHTML;
  const downloadStr = `data:image/svg+xml;base64,${btoa(html)}`;
  return downloadStr;
}

export function downloadSvg() {
  window.open(domElementToSvgString(WORD_CLOUD_DOM_ID), '_new');
}
