export const DEFAULT_SOURCES = '';

export const DEFAULT_COLLECTION = 9139487;

export const DEFAULT_COLLECTION_OBJECT_ARRAY = [{ id: DEFAULT_COLLECTION, tags_id: DEFAULT_COLLECTION, label: 'U.S. Top News' }];

export const PICK_COLLECTION = 0;
export const PICK_SOURCE = 1;
export const ADVANCED = 2;
export const STARRED = 3;

export function generateQueryParamString (queries) {
  const collection = queries.map(query => query.collections.map(c => `{"id":${c.id}, "label":"${c.label}"}`));
  const sources = queries.map(query => query.sources.map(c => `{"id":${c.id}}`));
  let urlParamString = queries.map((query, idx) => `{"index":${query.index},"q":"${query.q}","startDate":"${query.startDate}","endDate":"${query.endDate}","sources":[${sources[idx]}],"collections":[${collection[idx]}]}`);
  urlParamString = `[${urlParamString}]`;

  return urlParamString;

}
