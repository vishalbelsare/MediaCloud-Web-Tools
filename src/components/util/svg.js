
export const TEMP = 'TEMP';

export function domElementToSvgString(domId) {
  const elem = document.getElementById(domId);
  elem.setAttribute('title', domId);
  elem.setAttribute('version', 1.1);
  elem.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const html = elem.parentNode.innerHTML;
  const downloadStr = `data:image/svg+xml;base64,${btoa(html)}`;
  return downloadStr;
}

export function downloadSvg(domId) {
  window.open(domElementToSvgString(domId), '_new');
}
