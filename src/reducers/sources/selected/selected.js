import { combineReducers } from 'redux';
import { SELECT } from '../../../actions/sourceActions';
import details from './details/details';

const INITIAL_STATE = null;

function id(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SELECT:
      return action.payload ? parseInt(action.payload.id, 10) : state;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  id,
  details,
});

export default rootReducer;
