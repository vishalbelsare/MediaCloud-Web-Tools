import { trimToMaxLength } from './stringUtil';

export const DEFAULT_SOURCES = '';

export const DEFAULT_COLLECTION = 9139487;

export const DEFAULT_COLLECTION_OBJECT_ARRAY = [{ id: DEFAULT_COLLECTION, tags_id: DEFAULT_COLLECTION, label: 'U.S. Top News' }];

export const PICK_COLLECTION = 0;
export const PICK_SOURCE = 1;
export const ADVANCED = 2;
export const STARRED = 3;


export function generateQueryParamString(queries) {
  const queriesForUrl = queries.map(query => ({
    label: encodeURIComponent(query.label),
    q: encodeURIComponent(query.q),
    color: encodeURIComponent(query.color),
    startDate: query.startDate,
    endDate: query.endDate,
    sources: query.sources.map(s => s.id),
    collections: query.collections.map(s => s.id),
  }));
  return JSON.stringify(queriesForUrl);
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
