
export function trimToMaxLength(string, maxLength) {
  if ((string === undefined) || (string === null)) {
    return string;  // is this right, or should we return empty string?
  }
  if (string.length < maxLength) {
    return string;
  }
  return `${string.substring(0, maxLength)}...`;
}

export const TEMP = 'TEMP';
