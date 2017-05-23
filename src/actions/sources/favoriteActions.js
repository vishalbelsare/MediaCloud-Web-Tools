import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/sources';

export const FETCH_FAVORITE_COLLECTIONS = 'FETCH_FAVORITE_COLLECTIONS';
export const FETCH_FAVORITE_SOURCES = 'FETCH_FAVORITE_SOURCES';

export const fetchFavoriteCollections = createAsyncAction(FETCH_FAVORITE_COLLECTIONS, api.fetchFavoriteCollections);

export const fetchFavoriteSources = createAsyncAction(FETCH_FAVORITE_SOURCES, api.fetchFavoriteSources);
