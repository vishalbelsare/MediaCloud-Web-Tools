export const DEFAULT_SOURCES = '';

export const DEFAULT_COLLECTION = 9139487;

export const DEFAULT_COLLECTION_OBJECT_ARRAY = [{ id: DEFAULT_COLLECTION, tags_id: DEFAULT_COLLECTION, label: 'U.S. Top News' }];

export const PICK_COLLECTION = 0;
export const PICK_SOURCE = 1;
export const ADVANCED = 2;
export const STARRED = 3;


export function generateQueryParamString(queries) {
  const collection = queries.map(query => query.collections.map(c => `{"id":${c.id}, "label":"${c.label}"}`));
  const sources = queries.map(query => query.sources.map(c => `{"id":${c.id}}`));
  let urlParamString = queries.map((query, idx) => `{"index":${idx},"q":"${query.q}","startDate":"${query.startDate}","endDate":"${query.endDate}","sources":[${sources[idx]}],"collections":[${collection[idx]}]}`);
  urlParamString = `[${urlParamString}]`;

  return urlParamString;
}

const MAX_QUERY_LABEL_LENGTH = 60;

export function smartLabelForQuery(query) {
  let smartLabel = query.q;
  if (query.q.length > MAX_QUERY_LABEL_LENGTH) {
    smartLabel = `${smartLabel.substr(0, MAX_QUERY_LABEL_LENGTH)}...`;
  }
  return smartLabel;
}

export function queryPropertyHasChanged(queries, nextQueries, propName) {
  const currentProps = queries.map(q => q[propName]).reduce((allProps, prop) => allProps + prop);
  const nextProps = nextQueries.map(q => q[propName]).reduce((allProps, prop) => allProps + prop);
  const propHasChanged = currentProps !== nextProps;
  return propHasChanged;
}

