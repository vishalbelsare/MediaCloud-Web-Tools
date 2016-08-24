
export function notEmptyString(value) {
  return (value !== null) && (value !== undefined) && (value.trim() !== '');
}

export function other(value) {
  return (value !== null) && (value !== undefined) && (value.trim() !== '');
}
