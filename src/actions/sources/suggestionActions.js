import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/sources';

export const SUGGEST_SOURCE = 'SUGGEST_SOURCE';
export const UPDATE_SOURCE_SUGGESTION = 'UPDATE_SOURCE_SUGGESTION';
export const FETCH_SOURCE_SUGGESTIONS = 'FETCH_SOURCE_SUGGESTIONS';

export const suggestSource = createAsyncAction(SUGGEST_SOURCE, api.suggestSource);

export const updateSourceSuggestion = createAsyncAction(UPDATE_SOURCE_SUGGESTION, api.updateSourceSuggestion, payload => payload);

// accepts an 'all' boolean property
export const fetchSourceSuggestions = createAsyncAction(FETCH_SOURCE_SUGGESTIONS, api.listSourceSuggestions);
