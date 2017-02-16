import { FETCH_TOPIC_SUMMARY, SET_TOPIC_FAVORITE } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

export const TOPIC_SNAPSHOT_STATE_QUEUED = 'queued';
export const TOPIC_SNAPSHOT_STATE_RUNNING = 'running';
export const TOPIC_SNAPSHOT_STATE_COMPLETED = 'completed';
export const TOPIC_SNAPSHOT_STATE_ERROR = 'error';

const info = createAsyncReducer({
  action: FETCH_TOPIC_SUMMARY,
  handleSuccess: (payload) => {
    // add in a shortcut to the latest snapshot state
    let latestSnapshotState;
    if (payload.snapshot_status.job_states.length > 0) {
      latestSnapshotState = payload.snapshot_status.job_states[0].state;
    }
    return {
      ...payload,
      latestSnapshotState,
    };
  },
  [SET_TOPIC_FAVORITE]: (payload, state) =>
    // when someone favorites the topic form the control bar, update it locally without refetch from server
    Object.assign({}, state, {
      ...state,
      isFavorite: payload.args[1],
    }),
});

export default info;
