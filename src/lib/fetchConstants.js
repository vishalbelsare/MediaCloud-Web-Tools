
export const FETCH_INVALID = 'FETCH_INVALID';
export const FETCH_ONGOING = 'FETCH_ONGOING';
export const FETCH_SUCCEEDED = 'FETCH_SUCCEEDED';
export const FETCH_FAILED = 'FETCH_FAILED';

export const combineFetchStatuses = (fetchStatuses) => {
  const allInvalid = fetchStatuses.reduce((total, status) => total && (status === FETCH_INVALID), true);
  const anyOngoing = fetchStatuses.reduce((total, status) => total || (status === FETCH_ONGOING), false);
  const anyFailed = fetchStatuses.reduce((total, status) => total || (status === FETCH_FAILED), false);
  const allSucceeded = fetchStatuses.reduce((total, status) => total && (status === FETCH_SUCCEEDED), true);
  if (allInvalid) {
    return FETCH_INVALID;
  }
  if (anyOngoing) {
    return FETCH_ONGOING;
  }
  if (anyFailed) {
    return FETCH_FAILED;
  }
  if (allSucceeded) {
    return FETCH_SUCCEEDED;
  }
  return FETCH_ONGOING;
};
