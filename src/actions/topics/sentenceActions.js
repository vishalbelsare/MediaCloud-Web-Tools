import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/topics';

export const FETCH_TOPIC_SENTENCE_COUNT = 'FETCH_TOPIC_SENTENCE_COUNT';
export const FETCH_TOPIC_FOCAL_SET_SENTENCE_COUNTS = 'FETCH_TOPIC_FOCAL_SET_SENTENCE_COUNTS';

// pass in topicId, snapshotId, timespanId
export const fetchTopicSentenceCounts = createAsyncAction(FETCH_TOPIC_SENTENCE_COUNT, api.topicSentenceCounts);

// pass in topicId, focalSetId, filters
export const fetchTopicFocalSetSetenceCounts = createAsyncAction(FETCH_TOPIC_FOCAL_SET_SENTENCE_COUNTS, api.topicFocalSetSentenceCounts);
