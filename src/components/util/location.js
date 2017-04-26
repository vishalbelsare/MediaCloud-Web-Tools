
export function pagedAndSortedLocation(location, linkId, sort, newFilters) {
  return Object.assign({}, location, {
    query: {
      ...location.query,
      linkId,
      sort,
      ...newFilters,
    },
  });
}

export function pagedLocation(location, linkId) {
  return Object.assign({}, location, {
    query: {
      ...location.query,
      linkId,
    },
  });
}

export function filteredLocation(location, filters) {
  return Object.assign({}, location, {
    query: {
      ...location.query,
      ...filters,
    },
  });
}

export function filteredLinkTo(to, filters) {
  return {
    pathname: to,
    query: {
      snapshotId: filters.snapshotId,
      timespanId: filters.timespanId,
      focusId: filters.focusId,
      q: filters.q,
    },
  };
}

export function filtersAsUrlParams(filters) {
  return `snapshotId=${filters.snapshotId}&timespanId=${filters.timespanId || ''}&focusId=${filters.focusId || ''}&q=${filters.q || ''}`;
}

export function urlWithFilters(to, filters) {
  return `#${to}?${filtersAsUrlParams(filters)}`;
}
