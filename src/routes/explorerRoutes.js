import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRedirect from 'react-router/lib/IndexRedirect';
import Homepage from '../components/explorer/home/Homepage';
import DemoQueryContainer from '../components/explorer/builder/DemoQueryContainer';
import LoggedInQueryContainer from '../components/explorer/builder/LoggedInQueryContainer';
import userRoutes from './userRoutes';
import ExplorerApp from '../components/explorer/ExplorerApp';
import { requireAuth } from './routes';
// import About from '../components/explorer/About';

const explorerRoutes = (
  <Route path="/" component={ExplorerApp}>

    <IndexRedirect to="/home" />

    {userRoutes}

    <Route path="/home" component={Homepage} />
    <Route path="/queries">
      <Route path="demo" component={DemoQueryContainer} >
        <Route path="search" component={DemoQueryContainer} >
          <Route path=":keyword" component={DemoQueryContainer} />
        </Route>
        <Route path=":id" component={DemoQueryContainer} />
      </Route>
      <Route path=":queryParams" component={LoggedInQueryContainer} onEnter={requireAuth} />
    </Route>
  </Route>
);

export default explorerRoutes;
