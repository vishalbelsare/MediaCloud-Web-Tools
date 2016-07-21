
export function pagedAndSortedLocation(location, linkId, sort) {
  return Object.assign({}, location, {
    query: {
      ...location.query,
      linkId,
      sort,
    },
  });
}
