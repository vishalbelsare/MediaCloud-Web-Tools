import { createAction } from 'redux-actions';
import { createAsyncAction } from '../../lib/reduxHelpers';
import * as explorerApi from '../../lib/serverApi/explorer';

export const FETCH_TOP_ENTITIES_PEOPLE = 'FETCH_TOP_ENTITIES_PEOPLE';
export const FETCH_TOP_ENTITIES_ORGS = 'FETCH_TOP_ENTITIES_ORGS';
export const RESET_ENTITIES_PEOPLE = 'RESET_ENTITIES_PEOPLE';
export const RESET_ENTITIES_ORGS = 'RESET_ENTITIES_ORGS';

// pass in id, filters or q  - used by topics and explorer...
export const fetchTopEntitiesPeople = createAsyncAction(FETCH_TOP_ENTITIES_PEOPLE, explorerApi.fetchQueryTopEntitiesPeople, params => params);
export const fetchDemoTopEntitiesPeople = createAsyncAction(FETCH_TOP_ENTITIES_PEOPLE, explorerApi.fetchDemoQueryTopEntitiesPeople, params => params);

// pass in id, filters or q
export const fetchTopEntitiesOrgs = createAsyncAction(FETCH_TOP_ENTITIES_ORGS, explorerApi.fetchTopEntitiesOrgs, params => params);
export const fetchDemoTopEntitiesOrgs = createAsyncAction(FETCH_TOP_ENTITIES_ORGS, explorerApi.fetchDemoQueryTopEntitiesOrgs, params => params);

export const resetEntitiesPeople = createAction(RESET_ENTITIES_PEOPLE);
export const resetEntitiesOrgs = createAction(RESET_ENTITIES_ORGS);
