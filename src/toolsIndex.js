// import ReactGA from 'react-ga';
import { setAppName, setVersion } from './config';
import { setAppColors } from './styles/colors';
import routes from './routes/toolsRoutes';
import initializeApp from './index';

/**
 * This serves as the primary entry point to the Media Cloud Topic Mapper app.
 */

// ReactGA.initialize('UA-60744513-7');

setVersion('1.0.0');

setAppName('tools');

setAppColors({
  light: '#d896ff',
  dark: '#800080',
  darker: '#660066',
});

initializeApp(routes);
