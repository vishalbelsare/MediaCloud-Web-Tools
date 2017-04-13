import { FETCH_WORD_SAMPLE_SENTENCES } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const sampleSentences = createAsyncReducer({
  initialState: {
    sentences: [],
  },
  action: FETCH_WORD_SAMPLE_SENTENCES,
});

export default sampleSentences;
