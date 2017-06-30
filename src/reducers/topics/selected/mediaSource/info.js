import { FETCH_MEDIA, SELECT_MEDIA } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { mediaSourceMetadataProps } from '../../../../lib/tagUtil';

const info = createAsyncReducer({
  initialState: {
    id: null,
  },
  action: FETCH_MEDIA,
  [SELECT_MEDIA]: payload => ({ id: payload }),
  handleSuccess: payload => ({
    ...payload,
    media_id: parseInt(payload.media_id, 10), // make sure it is an int
    ...mediaSourceMetadataProps(payload),
  }),
});

export default info;
