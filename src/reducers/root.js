import { combineReducers } from 'redux';
import user from './user';
import topics from './topics/topics';
import sources from './sources/sources';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';

const rootReducer = combineReducers({
  user,
  topics,
  sources,
  form,
  routing,
});

export default rootReducer;
