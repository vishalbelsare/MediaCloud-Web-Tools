
export function trimToMaxLength(string, maxLength) {
  if (string.length < maxLength) {
    return string;
  }
  return `${string.substring(0, maxLength)}...`;
}

export const TEMP = 'TEMP';
