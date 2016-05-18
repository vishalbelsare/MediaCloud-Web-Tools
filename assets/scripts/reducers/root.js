import { combineReducers } from 'redux';
import user from './user';
import topics from './topics/topics';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';

const rootReducer = combineReducers({
  user,
  topics,
  form,
  routing,
});

export default rootReducer;
