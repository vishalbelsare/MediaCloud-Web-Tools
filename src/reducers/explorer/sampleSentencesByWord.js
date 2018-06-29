import { FETCH_WORD_SAMPLE_SENTENCES, RESET_WORD_SAMPLE_SENTENCES } from '../../actions/explorerActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const sampleSentencesByWord = createAsyncReducer({
  initialState: {
    sentences: [],
  },
  action: FETCH_WORD_SAMPLE_SENTENCES,
  [RESET_WORD_SAMPLE_SENTENCES]: () => ({
    sentences: [],
  }),
});

export default sampleSentencesByWord;
