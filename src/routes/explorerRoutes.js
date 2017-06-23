import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRedirect from 'react-router/lib/IndexRedirect';
import Homepage from '../components/explorer/home/Homepage';
import DemoQueryBuilderContainer from '../components/explorer/builder/DemoQueryBuilderContainer';
import QueryBuilderContainer from '../components/explorer/builder/QueryBuilderContainer';
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
      <Route path="demo" component={DemoQueryBuilderContainer} >
        <Route path="search" component={DemoQueryBuilderContainer} >
          <Route path=":keyword" component={DemoQueryBuilderContainer} />
        </Route>
        <Route path=":id" component={DemoQueryBuilderContainer} />
      </Route>
      <Route path=":queryParams" component={QueryBuilderContainer} onEnter={requireAuth} />
    </Route>
  </Route>
);

export default explorerRoutes;
