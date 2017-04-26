import { createPostingApiPromise } from './apiUtil';

export function saveToNotebook(content) {
  const params = { content: JSON.stringify(content) };
  return createPostingApiPromise('/api/notebook/save', params);
}

export const TEMP = 'temp';
