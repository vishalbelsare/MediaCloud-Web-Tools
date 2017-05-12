import { FETCH_FOCAL_SET_DEFINITIONS } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const list = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_FOCAL_SET_DEFINITIONS,
  handleSuccess: payload => ({
    list: payload.map((def) => {
      // make up for the fact that the API *doesn't* return an empty list if there aren't any definitions :-(
      const updatedDef = def;
      if (def.focus_definitions === undefined) {
        updatedDef.focus_definitions = [];
      }
      return def;
    }),
  }),
});

export default list;
