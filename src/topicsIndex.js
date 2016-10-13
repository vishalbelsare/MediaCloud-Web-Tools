import { setAppName } from './config';
import { setAppColors } from './styles/colors';
import routes from './routes/topicRoutes';
import store from './store';
import initializeApp from './index';
import { filterBySnapshot, filterByTimespan, filterByFocus } from './actions/topicActions';

/**
 * This serves as the primary entry point to the Media Cloud Topic Mapper app.
 */

setAppName('topics');

setAppColors({
  light: '#daf3ee',
  dark: '#47c4ac',
  darker: '#448e80',
});

// check if url has any params we care about
const hash = window.location.hash;
const hashParts = hash.split('?');
const args = {};
if (hashParts.length > 1) {
  const queryParts = hashParts[1].split('&');
  queryParts.forEach((part) => {
    const argParts = part.split('=');
    args[argParts[0]] = argParts[1];
  });
  if ('snapshotId' in args) {
    store.dispatch(filterBySnapshot(args.snapshotId));
  }
  if ('timespanId' in args) {
    store.dispatch(filterByTimespan(args.timespanId));
  }
  if ('focusId' in args) {
    store.dispatch(filterByFocus(args.focusId));
  }
}

initializeApp(routes);
