import { combineReducers } from 'redux';
import user from './user';
import controversies from './controversies/controversies';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';

const rootReducer = combineReducers({
  user,
  controversies,
  form,
  routing,
});

export default rootReducer;
