import { downloadViaFormPost } from '../../lib/apiUtil';

const SVG_HEADER = '<svg xmlns="http://www.w3.org/2000/svg">';
const SVG_FOOTER = '</svg>';

const DOWNLOAD_SVG_URL = '/api/download/svg';

// Helper to download SVG files that have been rendered in the browser
// filename - the filename you want to use, without the timestamp or .svg
// domIdOrElement - a DOM id, or DOM element, that contains a <g> *inside* of it
export function downloadSvg(filename, domIdOrElement) {
  let element;
  if (typeof domIdOrElement === 'string') {
    element = document.getElementById(domIdOrElement);
  } else {
    element = domIdOrElement;
  }
  const svgText = `${SVG_HEADER}${element.innerHTML}${SVG_FOOTER}`;
  downloadViaFormPost(DOWNLOAD_SVG_URL, { svgText, filename });
}

export const TEMP = 'temp'; // to resolve stupid linting error
