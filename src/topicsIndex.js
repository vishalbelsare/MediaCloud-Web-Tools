import ReactGA from 'react-ga';
import { setAppName, setVersion, APP_TOPIC_MAPPER } from './config';
import { setAppColors } from './styles/colors';
import routes from './routes/topicRoutes';
import initializeApp from './index';

/**
 * This serves as the primary entry point to the Media Cloud Topic Mapper app.
 */

ReactGA.initialize('UA-60744513-7');

setVersion('2.3.0');

setAppName(APP_TOPIC_MAPPER);

setAppColors({
  light: '#daf3ee',
  dark: '#47c4ac',
  darker: '#448e80',
});

initializeApp(routes);
