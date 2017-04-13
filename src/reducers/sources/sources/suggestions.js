import { FETCH_SOURCE_SUGGESTIONS, UPDATE_SOURCE_SUGGESTION } from '../../../actions/sourceActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';
import { sourceSuggestionDateToMoment } from '../../../lib/dateUtil';
import * as fetchConstants from '../../../lib/fetchConstants';

// dates returned are like this: "2016-03-15 14:23:58.161284"

const suggestions = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_SOURCE_SUGGESTIONS,
  handleSuccess: payload => ({
    // override default handler so we can change the string dates into JS date objects
    list: payload.list.map(suggestion => ({
      ...suggestion,
      createdDate: sourceSuggestionDateToMoment(suggestion.created_date).toDate(),
      dateMarked: sourceSuggestionDateToMoment(suggestion.date_marked).toDate(),
      dateSubmitted: sourceSuggestionDateToMoment(suggestion.date_submitted).toDate(),
    })),
  }),
  [UPDATE_SOURCE_SUGGESTION]: () => ({
    fetchStatus: fetchConstants.FETCH_ONGOING,
    list: [],
  }),
});

export default suggestions;
