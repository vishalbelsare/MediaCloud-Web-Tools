import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/topics';

export const FETCH_TOP_ENTITIES_PEOPLE_COVERAGE = 'FETCH_TOP_ENTITIES_PEOPLE_COVERAGE';
export const FETCH_TOP_ENTITIES_ORGS_COVERAGE = 'FETCH_TOP_ENTITIES_ORGS_COVERAGE';

// pass in id, filters or q  - used by topics and explorer...
export const fetchTopEntitiesPeople = createAsyncAction(FETCH_TOP_ENTITIES_PEOPLE_COVERAGE, api.fetchQueryTopEntitiesPeople);
export const fetchDemoTopEntitiesPeople = createAsyncAction(FETCH_TOP_ENTITIES_PEOPLE_COVERAGE, api.fetchDemoQueryTopEntitiesPeople);

// pass in id, filters or q
export const fetchTopEntitiesOrgs = createAsyncAction(FETCH_TOP_ENTITIES_ORGS_COVERAGE, api.fetchTopEntitiesOrgs);
export const fetchDemoTopEntitiesOrgs = createAsyncAction(FETCH_TOP_ENTITIES_ORGS_COVERAGE, api.fetchDemoQueryTopEntitiesOrgs);
