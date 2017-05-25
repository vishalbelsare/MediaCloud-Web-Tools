import { FETCH_SOURCE_DETAILS, SET_FAVORITE_SOURCE } from '../../../../actions/sourceActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { TAG_SET_PUBLICATION_COUNTRY, TAG_SET_PUBLICATION_STATE, TAG_SET_PRIMARY_LANGUAGE, TAG_SET_COUNTRY_OF_FOCUS }
  from '../../../../lib/tagUtil';

export const SOURCE_SCRAPE_STATE_QUEUED = 'queued';
export const SOURCE_SCRAPE_STATE_RUNNING = 'running';
export const SOURCE_SCRAPE_STATE_COMPLETED = 'completed';
export const SOURCE_SCRAPE_STATE_ERROR = 'error';

function tagForMetadata(metadataTagSetsId, allTags) {
  return allTags.find(tag => tag.tag_sets_id === metadataTagSetsId);
}

const sourceDetails = createAsyncReducer({
  initialState: {
  },
  action: FETCH_SOURCE_DETAILS,
  handleSuccess: (payload) => {
    // add in a shortcut to the latest scrape state
    let latestScrapeState;
    if (payload.scrape_status && payload.scrape_status.job_states.length > 0) {
      latestScrapeState = payload.scrape_status.job_states[0].state;
    }
    return {
      ...payload,
      media_id: parseInt(payload.media_id, 10), // make sure it is an int
      pubCountryTag: tagForMetadata(TAG_SET_PUBLICATION_COUNTRY, payload.media_source_tags),
      pubStateTag: tagForMetadata(TAG_SET_PUBLICATION_STATE, payload.media_source_tags),
      primaryLangaugeTag: tagForMetadata(TAG_SET_PRIMARY_LANGUAGE, payload.media_source_tags),
      countryOfFocusTag: tagForMetadata(TAG_SET_COUNTRY_OF_FOCUS, payload.media_source_tags),
      latestScrapeState,
    };
  },
  [SET_FAVORITE_SOURCE]: (payload, state) => ({
    ...state,
    isFavorite: payload.args[1],
  }),
});


export default sourceDetails;
