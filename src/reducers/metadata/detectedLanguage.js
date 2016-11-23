import { FETCH_METADATA_VALUES } from '../../actions/sourceActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const METADATA_LANGUAGE_TAG_SETS_ID = 123;

const detectedLanguage = createAsyncReducer({
  initialState: {
    tags: [],
    label: null,
  },
  action: FETCH_METADATA_VALUES,
  handleSuccess: (payload) => {
    // only save it here if the tag_sets_id id matches
    let results = {};
    if (payload.tag_sets_id === METADATA_LANGUAGE_TAG_SETS_ID) {
      results = payload;
    }
    return results;
  },
});

export default detectedLanguage;
