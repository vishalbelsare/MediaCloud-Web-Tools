import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRedirect from 'react-router/lib/IndexRedirect';
import IndexRoute from 'react-router/lib/IndexRoute';
import Redirect from 'react-router/lib/Redirect';
import HomeContainer from '../components/explorer/HomeContainer';
// import QueryBuilderContainer from '../components/explorer/QueryBuilderContainer';
import { requireAuth } from './routes';
import userRoutes from './userRoutes';
import SourcesApp from '../components/explorer/explorerApp';
import About from '../components/explorer/About';

const sourceRoutes = (
  <Route path="/" component={ExplorerApp}>

    <IndexRedirect to="/home" />

    {userRoutes}

    <Route path="/home" component={HomeContainer} />
    // <Route path="/queryBuilder" component={QueryBuilderContainer}/>
    
  </Route>
);

export default sourceRoutes;
