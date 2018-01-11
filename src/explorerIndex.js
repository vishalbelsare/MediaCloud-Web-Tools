import ReactGA from 'react-ga';
import { setAppName, setVersion } from './config';
import { setAppColors } from './styles/colors';
import routes from './routes/explorerRoutes';
import initializeApp from './index';

/**
 * This serves as the primary entry point to the Media Cloud Topic Mapper app.
 */

ReactGA.initialize('UA-60744513-11');

setVersion('2.2.0');

setAppName('explorer');

setAppColors({
  light: '#CF73C7',
  dark: '#8F3387',
  darker: '#8F3387',
});

initializeApp(routes);
