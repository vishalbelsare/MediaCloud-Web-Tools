import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRedirect from 'react-router/lib/IndexRedirect';
import Homepage from '../components/explorer/Homepage';
// import QueryBuilderContainer from '../components/explorer/QueryBuilderContainer';
import userRoutes from './userRoutes';
import ExplorerApp from '../components/explorer/ExplorerApp';
// import About from '../components/explorer/About';

const explorerRoutes = (
  <Route path="/" component={ExplorerApp}>

    <IndexRedirect to="/home" />

    {userRoutes}

    <Route path="/home" component={Homepage} />
  </Route>
);

export default explorerRoutes;
