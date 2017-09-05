import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRedirect from 'react-router/lib/IndexRedirect';
import Homepage from '../components/explorer/home/Homepage';
import About from '../components/explorer/About';
import DemoQueryContainer from '../components/explorer/builder/DemoQueryContainer';
import LoggedInQueryContainer from '../components/explorer/builder/LoggedInQueryContainer';
import ExplorerApp from '../components/explorer/ExplorerApp';
import { requireAuth } from './routes';
// import About from '../components/explorer/About';

const explorerRoutes = (
  <Route path="/" component={ExplorerApp}>

    <IndexRedirect to="/home" />
    <Route path="/about" component={About} />
    <Route path="/home" component={Homepage} />
    <Route path="/queries">
      <Route path="demo/search/:keyword" component={DemoQueryContainer} />
      <Route path="demo/:id" component={DemoQueryContainer} />
      <Route path="search/:queryParams" component={LoggedInQueryContainer} onEnter={requireAuth} />
    </Route>
  </Route>
);

export default explorerRoutes;
