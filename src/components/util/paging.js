
export function pagedAndSortedLocation(location, linkId, sort) {
  return Object.assign({}, location, {
    query: {
      ...location.query,
      linkId,
      sort,
    },
  });
}

export function filteredLocation(location, snapshotId, timespanId) {
  return Object.assign({}, location, {
    query: {
      ...location.query,
      snapshotId,
      timespanId,
    },
  });
}
