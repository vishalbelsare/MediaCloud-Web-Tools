import { combineQueryParams } from '../components/util/location';

export const TOPIC_PERSONAL = 'personal';

export const TOPIC_PUBLIC = 'public';

export const TOPIC_STARRED = 'favorited';

export const VIEW_1K = '1000';
export const VIEW_10K = '10000';

export function mergeFilters(currentProps, specificQueryFragment) {
  let filterObj = {};
  if (currentProps.filters) {
    filterObj = {
      ...currentProps.filters,
      ...currentProps.sample_size,
      q: combineQueryParams(currentProps.filters.q, specificQueryFragment),
    };
  } else {
    filterObj = {
      ...currentProps.sample_size,
      q: specificQueryFragment,
    };
  }
  return filterObj;
}
