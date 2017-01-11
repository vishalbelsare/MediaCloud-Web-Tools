import { UPLOAD_SOURCE_LIST_FROM_TEMPLATE } from '../../../../actions/sourceActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const toUpload = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: UPLOAD_SOURCE_LIST_FROM_TEMPLATE,
  handleSuccess: (payload) => {
    if (payload.status && payload.status.indexOf('Error') > -1) {
    // best way to handle UI need for id vs media_id field?
      return { list: [], error: payload.status };
    }
    return { list: payload.results.map(m => ({ ...m, id: m.media_id })) };
  },
});

export default toUpload;
