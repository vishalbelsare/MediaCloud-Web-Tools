import { setAppName } from './config.js';
import { setAppColors } from './styles/colors.js';
import routes from './routes/sourceRoutes';
import initializeApp from './index.js';

setAppName('sources');

setAppColors({
  light: '#4b9fcb',
  dark: '#3c97bd',
});

initializeApp(routes);
