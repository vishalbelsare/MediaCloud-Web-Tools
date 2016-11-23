
export function notEmptyString(value) {
  return (value !== null) && (value !== undefined) && (value.trim() !== '');
}

export function emptyString(value) {
  return (value === null) || (value === undefined) || (value.trim() === '');
}

export function validEmail(value) {
  return (value && /^[^@]+@[^@]+\.[^@]+$/i.test(value.email));
}
