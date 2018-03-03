import { downloadViaFormPost } from '../../lib/apiUtil';

const SVG_HEADER = '<svg xmlns="http://www.w3.org/2000/svg">';
const SVG_FOOTER = '</svg>';

const DOWNLOAD_SVG_URL = '/api/download/svg';

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
