import { trimToMaxLength } from './stringUtil';
import { notEmptyString } from './formValidators';

export const DEFAULT_SOURCES = '';

export const DEFAULT_COLLECTION = 9139487;

export const DEFAULT_COLLECTION_OBJECT_ARRAY = [{ id: DEFAULT_COLLECTION, tags_id: DEFAULT_COLLECTION, label: 'U.S. Top News' }];

export const PICK_COLLECTION = 0;
export const PICK_SOURCE = 1;
export const PICK_COUNTRY = 2;
export const PICK_ADVANCED = 3;

export function generateQueryParamObject(query) {
  return {
    label: encodeURIComponent(query.label),
    q: encodeURIComponent(query.q),
    color: encodeURIComponent(query.color),
    startDate: query.startDate,
    endDate: query.endDate,
    sources: query.sources && query.sources.length > 0 ? query.sources.map(s => (s.id ? s.id : s)) : [], // id field or the id itself
    collections: query.collections && query.collections.length > 0 ? query.collections.map(s => (s.id ? s.id : s)) : [],
  };
}

export function generateQueryParamString(queries) {
  const queriesForUrl = queries.map(generateQueryParamObject);
  return JSON.stringify(queriesForUrl);
}

export function decodeQueryParamString(queryString) {
  const queriesForUrl = JSON.parse(queryString).map(query => ({
    label: notEmptyString(query.label) ? decodeURIComponent(query.label) : '',
    q: notEmptyString(query.q) ? decodeURIComponent(query.q) : '*',
    color: notEmptyString(query.color) ? decodeURIComponent(query.color) : '',
    startDate: query.startDate,
    endDate: query.endDate,
    sources: query.sources, // de-aggregate media bucket into sources and collections
    collections: query.collections,
  }));
  return queriesForUrl;
}

export function queryPropertyHasChanged(queries, nextQueries, propName) {
  const currentProps = queries.map(q => q[propName]).reduce((allProps, prop) => allProps + prop);
  const nextProps = nextQueries.map(q => q[propName]).reduce((allProps, prop) => allProps + prop);
  const propHasChanged = currentProps !== nextProps;
  return propHasChanged;
}

// TODO: implement this logic from Dashboard
const MAX_QUERY_LABEL_LENGTH = 60;
export const autoMagicQueryLabel = query => decodeURIComponent(trimToMaxLength(query.q, MAX_QUERY_LABEL_LENGTH));


// This handles samples or user-generated queries for you.  To handle quotes and utf and such, we do this
// via a form submission (after trying lots of other options).
export function postToDownloadUrl(url, query) {
  const name = 'download.csv';
  // figure out if it is sample or user-created query
  const data = { index: query.index };
  if (parseInt(query.searchId, 10) >= 0) {
    data.sampleId = query.searchId;
  } else {
    data.q = JSON.stringify(generateQueryParamObject(query));
  }
  const windowOptions = 'width=730,height=345,left=100,top=100,resizable=no,scrollbars=no';
  // make a form with all the info we want to submit
  const form = document.createElement('form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', url);
  form.setAttribute('target', 'downloading');
  Object.keys(data).forEach((key) => {
    if ({}.hasOwnProperty.call(data, key)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = data[key];
      form.appendChild(input);
    }
  });
  document.body.appendChild(form);
  window.open(url, name, windowOptions);
  form.submit();
  document.body.removeChild(form);
}
