import { createAction } from 'redux-actions';
import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/system';


export const SELECT_MEDIAPICKER_QUERY_ARGS = 'SELECT_MEDIAPICKER_QUERY_ARGS';
export const selectMediaPickerQueryArgs = createAction(SELECT_MEDIAPICKER_QUERY_ARGS, args => args);

export const FETCH_FEATURED_COLLECTIONS_FOR_QUERY = 'FETCH_FEATURED_COLLECTIONS_FOR_QUERY';
export const fetchMediaPickerFeaturedCollections = createAsyncAction(FETCH_FEATURED_COLLECTIONS_FOR_QUERY, api.fetchMediaPickerFeaturedCollections);

export const FETCH_MEDIAPICKER_COLLECTION_SEARCH = 'FETCH_MEDIAPICKER_COLLECTION_SEARCH';
export const fetchMediaPickerCollections = createAsyncAction(FETCH_MEDIAPICKER_COLLECTION_SEARCH, api.fetchMediaPickerCollections, params => params);
export const RESET_MEDIAPICKER_COLLECTION_SEARCH = 'RESET_MEDIAPICKER_COLLECTION_SEARCH';

export const FETCH_MEDIAPICKER_SOURCE_SEARCH = 'FETCH_MEDIAPICKER_SOURCE_SEARCH';
export const fetchMediaPickerSources = createAsyncAction(FETCH_MEDIAPICKER_SOURCE_SEARCH, api.fetchMediaPickerSources, params => params);
export const RESET_MEDIAPICKER_SOURCE_SEARCH = 'RESET_MEDIAPICKER_SOURCE_SEARCH';

export const SELECT_MEDIA = 'SELECT_MEDIA';
export const selectMedia = createAction(SELECT_MEDIA, media => media);

export const CLEAR_SELECTED_MEDIA = 'CLEAR_SELECTED_MEDIA';
export const clearSelectedMedia = createAction(CLEAR_SELECTED_MEDIA, media => media);
