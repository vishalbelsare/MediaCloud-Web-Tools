import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import { combineReducers } from 'redux';
import app from './app';
import user from './user';
import topics from './topics/topics';
import sources from './sources/sources';

const rootReducer = combineReducers({
  app,
  user,
  topics,
  sources,
  form,
  routing,
});

export default rootReducer;
