import React from 'react';
import { Route, IndexRoute } from 'react-router';
import SourceDetailsContainer from '../components/source/details/SourceDetailsContainer';
import SourceCollectionDetailsContainer from '../components/source/details/SourceCollectionDetailsContainer';
import SourceListContainer from '../components/source/SourceListContainer';
import CollectionListContainer from '../components/source/CollectionListContainer';
import requireAuth from './routes.js';

const sourceRoutes = (
  <Route path="/sources" >
    <Route path="/home" component={SourceListContainer} onEnter={requireAuth} />
    <Route path="/sources" >
        <IndexRoute component={SourceListContainer} onEnter={requireAuth} />
        <Route path="/sources/list" component={SourceListContainer} onEnter={requireAuth} />
        <Route path="/sources/:sourceId/details" component={SourceDetailsContainer} onEnter={requireAuth} />
    </Route>
    <Route path="/collections" >
      <IndexRoute component={CollectionListContainer} onEnter={requireAuth} />
      <Route path="/collections/list" component={CollectionListContainer} onEnter={requireAuth} />
      <Route path="/collections/:sourceId/details" component={SourceCollectionDetailsContainer} onEnter={requireAuth} />
    </Route>
  </Route>
);

export default sourceRoutes;
