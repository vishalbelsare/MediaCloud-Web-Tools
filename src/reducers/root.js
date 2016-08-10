import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import { combineReducers } from 'redux';
import brand from './brand';
import user from './user';
import topics from './topics/topics';
import sources from './sources/sources';

const rootReducer = combineReducers({
  brand,
  user,
  topics,
  sources,
  form,
  routing,
});

export default rootReducer;
