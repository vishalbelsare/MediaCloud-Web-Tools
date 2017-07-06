import { FETCH_TOPIC_WORD2VEC } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const word2VecEmbeddings = createAsyncReducer({
  initialState: {
    embeddings: [],
  },
  action: FETCH_TOPIC_WORD2VEC,
});

export default word2VecEmbeddings;
