import { createAction } from 'redux-actions';
import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/sources';

export const SELECT_ADVANCED_SEARCH_SOURCE = 'SELECT_ADVANCED_SEARCH_SOURCE';
export const SELECT_ADVANCED_SEARCH_COLLECTION = 'SELECT_ADVANCED_SEARCH_COLLECTION';
export const RESET_ADVANCED_SEARCH_COLLECTION = 'RESET_ADVANCED_SEARCH_COLLECTION';
export const RESET_ADVANCED_SEARCH_SOURCE = 'RESET_ADVANCED_SEARCH_SOURCE';
export const FETCH_SOURCE_SEARCH = 'FETCH_SOURCE_SEARCH';
export const RESET_SOURCE_SEARCH = 'RESET_SOURCE_SEARCH';
export const FETCH_COLLECTION_SEARCH = 'FETCH_COLLECTION_SEARCH';
export const RESET_COLLECTION_SEARCH = 'RESET_COLLECTION_SEARCH';
export const FETCH_SOURCE_BY_METADATA = 'FETCH_SOURCE_BY_METADATA';
export const FETCH_COLLECTION_BY_METADATA = 'FETCH_COLLECTION_BY_METADATA';

export const fetchSourceSearch = createAsyncAction(FETCH_SOURCE_SEARCH, api.sourceSearch, string => string);

export const resetSourceSearch = createAction(RESET_SOURCE_SEARCH);

export const fetchCollectionSearch = createAsyncAction(FETCH_COLLECTION_SEARCH, api.collectionSearch, string => string);

export const resetCollectionSearch = createAction(RESET_COLLECTION_SEARCH);

export const fetchSourceByMetadata = createAsyncAction(FETCH_SOURCE_BY_METADATA, api.sourceAdvancedSearch, payload => payload);

export const fetchCollectionByMetadata = createAsyncAction(FETCH_COLLECTION_BY_METADATA, api.collectionSearch, string => string);

export const selectAdvancedSearchSource = createAction(SELECT_ADVANCED_SEARCH_SOURCE, payload => payload);

export const selectAdvancedSearchCollection = createAction(SELECT_ADVANCED_SEARCH_COLLECTION, payload => payload);

export const resetAdvancedSearchSource = createAction(RESET_ADVANCED_SEARCH_SOURCE);

export const resetAdvancedSearchCollection = createAction(RESET_ADVANCED_SEARCH_COLLECTION);
