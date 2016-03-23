
export default store => next => action => {
  if(action.hasOwnProperty('payload')){
    if(action.payload.hasOwnProperty('promise')){
      console.log('in middleware', action);
    }
  }
  return next(action);
}
