import ReactGA from 'react-ga';
import { setAppName, setVersion } from './config';
import { setAppColors } from './styles/colors';
import routes from './routes/topicRoutes';
import initializeApp from './index';

/**
 * This serves as the primary entry point to the Media Cloud Topic Mapper app.
 */

ReactGA.initialize('UA-60744513-7');

setVersion('2.1.0');

setAppName('topics');

setAppColors({
  light: '#58DBCC',
  dark: '#38BBAC',  // primary
  darker: '#189B8C',
});

initializeApp(routes);
