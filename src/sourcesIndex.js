import ReactGA from 'react-ga';
import { setAppName, setVersion } from './config';
import { setAppColors } from './styles/colors';
import routes from './routes/sourceRoutes';
import initializeApp from './index';

/**
 * This serves as the primary entry point to the Media Cloud Source Manager app.
 */

ReactGA.initialize('UA-60744513-8');

setVersion('1.9.1');

setAppName('sources');

setAppColors({
  light: '#4b9fcb',
  dark: '#3c97bd',
  darker: '#39788e',
});

initializeApp(routes);
