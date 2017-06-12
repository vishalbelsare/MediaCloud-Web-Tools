import { createPostingApiPromise, createApiPromise, acceptParams } from './apiUtil';

export function saveToNotebook(content) {
  const params = { content: JSON.stringify(content) };
  return createPostingApiPromise('/api/notebook/save', params);
}

export function allNotebookClippings(params) {
  const acceptedParams = acceptParams(params, ['app']);
  return createApiPromise('/api/notebook/clippings', acceptedParams);
}
