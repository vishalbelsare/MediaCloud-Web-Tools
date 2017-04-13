
export function domElementToSvgString(domIdOrElement) {
  let elem;
  if (typeof domIdOrElement === 'string') {
    elem = document.getElementById(domIdOrElement);
    elem.setAttribute('title', elem);
  } else {
    elem = domIdOrElement;
    elem.setAttribute('title', 'SVG');
  }
  elem.setAttribute('version', 1.1);
  elem.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const html = elem.parentNode.innerHTML;
  const downloadStr = `data:image/svg+xml;base64,${btoa(html)}`;
  return downloadStr;
}

export function downloadSvg(domIdOrElement) {
  window.open(domElementToSvgString(domIdOrElement), '_new');
}
