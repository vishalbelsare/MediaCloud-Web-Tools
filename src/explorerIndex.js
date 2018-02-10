import ReactGA from 'react-ga';
import { setAppName, setVersion } from './config';
import { setAppColors } from './styles/colors';
import routes from './routes/explorerRoutes';
import initializeApp from './index';

/**
 * This serves as the primary entry point to the Media Cloud Topic Mapper app.
 */

ReactGA.initialize('UA-60744513-11');

setVersion('2.1.0');

setAppName('explorer');

setAppColors({
  light: '#AF53A7',
  dark: '#8F3387',  // primary
  darker: '#6F1367',
});

initializeApp(routes);
