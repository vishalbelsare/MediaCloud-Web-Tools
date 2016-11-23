import { combineReducers } from 'redux';
import detectedLanguage from './detectedLanguage';

const rootReducer = combineReducers({
  detectedLanguage,
});

export default rootReducer;
