import ReactGA from 'react-ga';
import { setAppName, setVersion } from './config';
import { setAppColors } from './styles/colors';
import routes from './routes/explorerRoutes';
import initializeApp from './index';

/**
 * This serves as the primary entry point to the Media Cloud Topic Mapper app.
 */

ReactGA.initialize('UA-60744513-7');

setVersion('1.7.0');

setAppName('explorer');

setAppColors({
  light: '#daf3ee',
  dark: '#e14c11',
  darker: '#e14c11',
});

initializeApp(routes);
