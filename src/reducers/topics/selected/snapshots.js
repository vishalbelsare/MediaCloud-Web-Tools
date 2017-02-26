import { FETCH_TOPIC_SNAPSHOTS_LIST } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

export const TOPIC_SNAPSHOT_STATE_QUEUED = 'queued';
export const TOPIC_SNAPSHOT_STATE_RUNNING = 'running';
export const TOPIC_SNAPSHOT_STATE_COMPLETED = 'completed';
export const TOPIC_SNAPSHOT_STATE_ERROR = 'error';

export const snapshotIsUsable = s => (s.state === TOPIC_SNAPSHOT_STATE_COMPLETED) && (s.searchable === 1);

const snapshots = createAsyncReducer({
  initialState: {
    list: [],
    jobStatus: [],
  },
  action: FETCH_TOPIC_SNAPSHOTS_LIST,
  handleSuccess: payload => ({
    // add in an isUsable property to centralize that logic to one place (ie. here!)
    list: payload.list.map(s => ({
      ...s,
      isUsable: snapshotIsUsable(s),
    })),
    jobStatus: payload.jobStatus,
  }),
});

export default snapshots;
