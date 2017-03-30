
export function notEmptyString(value) {
  return (value !== null) && (value !== undefined) && (value.trim() !== '');
}

export function emptyString(value) {
  return (value === null) || (value === undefined) || (value.trim() === '');
}

export function validEmail(value) {
  return notEmptyString(value) && /^[^@]+@[^@]+\.[^@]+$/i.test(value);
}

export function invalidEmail(value) {
  return !validEmail(value);
}

export function nullOrUndefined(value) {
  return (value === null) || (value === undefined);
}
