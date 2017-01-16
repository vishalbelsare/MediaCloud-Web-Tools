import { createApiPromise, createPostingApiPromise, acceptParams, generateParamStr } from './apiUtil';

// possible return statuses from a call to createSource
export const CREATE_SOURCE_STATUS_NEW = 'new';
export const CREATE_SOURCE_STATUS_EXISTING = 'existing';
export const CREATE_SOURCE_STATUS_ERROR = 'error';

// possible statuses to send to a call to updateSourceSuggestion
// export const UPDATE_SOURCE_SUGGESTION_STATUS_PENDING = 'pending';
export const UPDATE_SOURCE_SUGGESTION_STATUS_APPROVED = 'approved';
export const UPDATE_SOURCE_SUGGESTION_STATUS_REJECTED = 'rejected';

export function sourcesByIds(params) {
  const acceptedParams = acceptParams(params, ['src']);
  acceptedParams['src[]'] = params;
  return createApiPromise('api/sources/list', acceptedParams);
}

export function sourceSearch(searchStr) {
  return createApiPromise(`/api/sources/search/${searchStr}`);
}

export function sourceAdvancedSearch(params) {
  const acceptedParams = acceptParams(params, ['searchString', 'tags']);
  const paramStr = generateParamStr({ 'tags[]': acceptedParams.tags });
  const searchStr = acceptedParams.searchString || '*';
  return createApiPromise(`/api/sources/search/${searchStr}?${paramStr}`);
}

export function collectionList(id) {
  return createApiPromise(`api/collections/set/${id}`);
}

export function collectionsByIds(params) {
  const acceptedParams = acceptParams(params, ['coll']);
  acceptedParams['coll[]'] = params;
  return createApiPromise('api/collections/list', acceptedParams);
}

export function collectionSearch(searchStr) {
  return createApiPromise(`/api/collections/search/${searchStr}`);
}

export function sourceDetails(id) {
  return createApiPromise(`/api/sources/${id}/details`);
}

export function collectionDetails(id) {
  return createApiPromise(`/api/collections/${id}/details`);
}

export function sourceSentenceCount(id) {
  return createApiPromise(`api/sources/${id}/sentences/count`);
}

export function collectionSentenceCount(id) {
  return createApiPromise(`api/collections/${id}/sentences/count`);
}

export function sourceGeography(id) {
  return createApiPromise(`api/sources/${id}/geography`);
}

export function collectionGeography(id) {
  return createApiPromise(`api/collections/${id}/geography`);
}

export function sourceWordCount(id) {
  return createApiPromise(`api/sources/${id}/words`);
}

export function collectionWordCount(id) {
  return createApiPromise(`api/collections/${id}/words`);
}

export function similarCollections(id) {
  return createApiPromise(`api/collections/${id}/similarCollections`);
}

export function collectionSourceStoryCounts(id) {
  return createApiPromise(`api/collections/${id}/sources/sentences/count`);
}

export function createCollection(params) {
  const acceptedParams = acceptParams(params, ['name', 'description', 'static', 'sources[]', 'showOnStories', 'showOnMedia']);
  return createPostingApiPromise('/api/collections/create', acceptedParams);
}

export function updateCollection(params) {
  const acceptedParams = acceptParams(params, ['id', 'name', 'description', 'static', 'sources[]', 'showOnStories', 'showOnMedia']);
  return createPostingApiPromise(`/api/collections/${acceptedParams.id}/update`, acceptedParams);
}

export function addSourceToCollection(params) {
  const acceptedParams = acceptParams(params, ['sourceObj']);
  return acceptedParams;
}

export function metadataValues(id) {
  return createApiPromise(`api/metadata/${id}/values`);
}

export function createSource(params) {
  const acceptedParams = acceptParams(params, ['name', 'url', 'notes', 'publicNotes', 'monitored', 'publicationCountry', 'collections[]']);
  return createPostingApiPromise('/api/sources/create', acceptedParams);
}

export function updateSource(params) {
  const acceptedParams = acceptParams(params, ['id', 'name', 'url', 'notes', 'publicNotes', 'monitored', 'publicationCountry']);
  acceptedParams['collections[]'] = params.collections.map(c => c.tags_id);
  return createPostingApiPromise(`/api/sources/${acceptedParams.id}/update`, acceptedParams);
}

export function sourceFeeds(id) {
  return createApiPromise(`api/sources/${id}/feeds`);
}

export function suggestSource(params) {
  const acceptedParams = acceptParams(params, ['name', 'url', 'feedurl', 'reason', 'collections[]']);
  return createPostingApiPromise('/api/sources/suggestions/submit', acceptedParams);
}

export function listSourceSuggestions(params) {
  const acceptedParams = acceptParams(params, ['all']);
  const all = acceptedParams.all || false;
  return createApiPromise(`/api/sources/suggestions?all=${all ? 1 : 0}`);
}

export function updateSourceSuggestion(params) {
  const acceptedParams = acceptParams(params, ['suggestionId', 'status', 'reason']);
  return createPostingApiPromise(`/api/sources/suggestions/${acceptedParams.suggestionId}/update`, acceptedParams);
}

export function collectionUploadSourceListFromTemplate(params) {
  const acceptedParams = acceptParams(params, ['file']);
  return createPostingApiPromise('/api/collections/uploadSourceListFromTemplate', acceptedParams);
}

