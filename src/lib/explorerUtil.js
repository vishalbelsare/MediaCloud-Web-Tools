import { trimToMaxLength } from './stringUtil';
import { notEmptyString } from './formValidators';

export const DEFAULT_SOURCES = '';

export const DEFAULT_COLLECTION = 9139487;

export const DEFAULT_COLLECTION_OBJECT_ARRAY = [{ id: DEFAULT_COLLECTION, tags_id: DEFAULT_COLLECTION, label: 'U.S. Top News' }];

export const PICK_COLLECTION = 0;
export const PICK_SOURCE = 1;
export const PICK_COUNTRY = 2;
export const PICK_ADVANCED = 3;

export function generateQueryParamString(queries) {
  const queriesForUrl = queries.map(query => ({
    label: encodeURIComponent(query.label),
    q: encodeURIComponent(query.q),
    color: encodeURIComponent(query.color),
    startDate: query.startDate,
    endDate: query.endDate,
    sources: query.sources && query.sources.length > 0 ? query.sources.map(s => (s.id ? s.id : s)) : [], // id field or the id itself
    collections: query.collections && query.collections.length > 0 ? query.collections.map(s => (s.id ? s.id : s)) : [],
  }));
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
