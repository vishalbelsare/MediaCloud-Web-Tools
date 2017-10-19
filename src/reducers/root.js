import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import { combineReducers } from 'redux';
import app from './app';
import user from './user';
import topics from './topics/topics';
import sources from './sources/sources';
import system from './system/system';
import notebook from './notebook/notebook';
import explorer from './explorer/explorer';
import story from './story/story';

const rootReducer = combineReducers({
  app,
  user,
  topics,
  sources,
  system,
  form,
  routing,
  notebook,
  explorer,
  story,
});

export default rootReducer;
