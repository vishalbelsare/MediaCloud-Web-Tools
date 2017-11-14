import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/topics';

export const FETCH_TOP_ENTITIES_PEOPLE_COVERAGE = 'FETCH_TOP_ENTITIES_PEOPLE_COVERAGE';
export const FETCH_TOP_ENTITIES_ORGS_COVERAGE = 'FETCH_TOP_ENTITIES_ORGS_COVERAGE';

// pass in topic id, filters
export const fetchTopicEntitiesPeople = createAsyncAction(FETCH_TOP_ENTITIES_PEOPLE_COVERAGE, api.topicTopPeople);

// pass in topic id, filters
export const fetchTopicEntitiesOrgs = createAsyncAction(FETCH_TOP_ENTITIES_ORGS_COVERAGE, api.topicTopOrgs);
