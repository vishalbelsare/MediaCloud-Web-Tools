import { setAppName, setVersion } from './config';
import { setAppColors } from './styles/colors';
import routes from './routes/topicRoutes';
import initializeApp from './index';

/**
 * This serves as the primary entry point to the Media Cloud Topic Mapper app.
 */

setVersion('1.1.3');

setAppName('topics');

setAppColors({
  light: '#daf3ee',
  dark: '#47c4ac',
  darker: '#448e80',
});

initializeApp(routes);
