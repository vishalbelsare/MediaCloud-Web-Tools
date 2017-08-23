export const DEFAULT_SOURCES = '';

export const DEFAULT_COLLECTION = 9139487;

export const DEFAULT_COLLECTION_OBJECT_ARRAY = [{ id: DEFAULT_COLLECTION, tags_id: DEFAULT_COLLECTION, label: 'U.S. Top News' }];

export const PICK_COLLECTION = 0;
export const PICK_SOURCE = 1;
export const ADVANCED = 2;
export const STARRED = 3;

const MAX_QUERY_LABEL_LENGTH = 60;

export function smartLabelForQuery(query) {
  let smartLabel = query.q;
  if (query.q.length > MAX_QUERY_LABEL_LENGTH) {
    smartLabel = `${smartLabel.substr(0, MAX_QUERY_LABEL_LENGTH)}...`;
  }
  return smartLabel;
}
