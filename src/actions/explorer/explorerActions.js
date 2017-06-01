import { createAction } from 'redux-actions';
import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/explorer';

export const SET_QUERY_LIST = 'SET_QUERY_LIST';
export const setQueryList = createAction(SET_QUERY_LIST, queries => queries);

export const FETCH_SAVED_QUERY_LIST = 'FETCH_SAVED_QUERY_LIST';
export const fetchSavedQueryList = createAsyncAction(FETCH_SAVED_QUERY_LIST, api.fetchSavedQueryList);


export const SELECT_QUERY = 'SELECT_QUERY';
export const selectQuery = createAction(SELECT_QUERY, query => query);

export const PREPARE_QUERIES = 'PREPARE_QUERIES';
export const prepareQueries = createAsyncAction(PREPARE_QUERIES, api.prepareQueries);
