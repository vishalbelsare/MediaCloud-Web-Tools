import moment from 'moment';
import { FETCH_STORY, SELECT_STORY } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const TAG_SET_DATE_GUESS_METHOD = 508;
const TAG_SET_EXTRACTOR_VERSION = 1354;

// returns undefined if it is not found
function tagWithTagSetsId(tags, tagSetsId) {
  const tag = tags.find(t => t.tag_sets_id === tagSetsId);
  return (tag) ? tag.tag : undefined;
}

const info = createAsyncReducer({
  initialState: {
    id: null,
  },
  action: FETCH_STORY,
  handleSuccess: payload => ({
    ...payload,
    publishDateObj: moment(payload.publish_date).toDate(),
    dateGuessMethod: tagWithTagSetsId(payload.story_tags, TAG_SET_DATE_GUESS_METHOD),
    extractorVersion: tagWithTagSetsId(payload.story_tags, TAG_SET_EXTRACTOR_VERSION),
  }),
  [SELECT_STORY]: payload => ({ id: payload }),
});

export default info;
