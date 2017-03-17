
export function notEmptyString(value) {
  return (value !== null) && (value !== undefined) && (value.trim() !== '');
}

export function emptyString(value) {
  return (value === null) || (value === undefined) || (value.trim() === '');
}

export function validEmail(value) {
  return (value && /^[^@]+@[^@]+\.[^@]+$/i.test(value.email));
}

export function nullOrUndefined(value) {
  return (value === null) || (value === undefined);
}

const topicDatePattern = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/g;

export function invalidDate(value) {
  return topicDatePattern.test(value) !== true;
}
