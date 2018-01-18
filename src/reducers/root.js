import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import { combineReducers } from 'redux';
import { APP_TOOLS, APP_TOPIC_MAPPER, APP_SOURCE_MANAGER, APP_EXPLORER } from '../config';
import app from './app';
import user from './user';
import topics from './topics/topics';
import explorer from './explorer/explorer';
import sources from './sources/sources';
import system from './system/system';
import notebook from './notebook/notebook';
import story from './story/story';

function getRootReducer(appName) {
  // only load the reducer for the appropriate app
  let appReducer;
  switch (appName) {
    case APP_TOPIC_MAPPER:
      appReducer = topics;
      break;
    case APP_SOURCE_MANAGER:
      appReducer = sources;
      break;
    case APP_EXPLORER:
      appReducer = explorer;
      break;
    case APP_TOOLS:
    default:
      appReducer = null;
      break;
  }

  const defaultReducers = {
    app,
    user,
    system,
    form,
    routing,
    notebook,
    story,
  };

  let reducers = {};
  reducers[appName] = appReducer;
  reducers = Object.assign(reducers, defaultReducers);

  const rootReducer = combineReducers(reducers);

  return rootReducer;
}

export default getRootReducer;
