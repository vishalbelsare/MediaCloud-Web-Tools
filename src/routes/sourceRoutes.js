import React from 'react';
import { Route } from 'react-router';
import SourceDetailsContainer from '../components/source/details/SourceDetailsContainer';
import SourceCollectionDetailsContainer from '../components/source/details/SourceCollectionDetailsContainer';
import SourceListContainer from '../components/source/SourceListContainer';
import SourceSearchContainer from '../components/source/SourceSearchContainer';
import SourceCollectionListContainer from '../components/source/SourceCollectionListContainer';
import requireAuth from './routes.js';

const sourceRoutes = (
  <Route path="/sources" >
    <Route path="/home" component={SourceCollectionListContainer} onEnter={requireAuth} />
    <Route path="/source" >
        <Route path="search" component={SourceSearchContainer} />
        <Route path="list" component={SourceListContainer} onEnter={requireAuth} />
        <Route path=":sourceId/details" component={SourceDetailsContainer} onEnter={requireAuth} />
    </Route>
    <Route path="/collection" >
      <Route path="list" component={SourceCollectionListContainer} onEnter={requireAuth} />
      <Route path=":sourceId/details" component={SourceCollectionDetailsContainer} />
    </Route>
  </Route>
);

export default sourceRoutes;
