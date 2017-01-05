import { UPLOAD_SOURCE_LIST_FROM_TEMPLATE } from '../../../../actions/sourceActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const createOrUpdateSourcesByTemplate = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: UPLOAD_SOURCE_LIST_FROM_TEMPLATE,
  handleSuccess: payload => ({
    // note these are the associated sources given an array of collection ids
    list: payload,
  }),
});

export default createOrUpdateSourcesByTemplate;
