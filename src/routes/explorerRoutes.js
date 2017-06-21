import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRedirect from 'react-router/lib/IndexRedirect';
import Homepage from '../components/explorer/home/Homepage';
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
    <Route path="/queries" component={QueryBuilderContainer}>
      <Route path="demo" component={QueryBuilderContainer} >
        <Route path="search" component={QueryBuilderContainer} />
        <Route path=":id" component={QueryBuilderContainer} />
      </Route>
      <Route path=":queryParams" component={QueryBuilderContainer} onEnter={requireAuth} />
    </Route>
  </Route>
);

export default explorerRoutes;
