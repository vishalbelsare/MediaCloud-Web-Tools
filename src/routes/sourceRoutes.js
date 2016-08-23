import React from 'react';
import Route from 'react-router/lib/Route';
import SourceDetailsContainer from '../components/source/mediaSource/SourceDetailsContainer';
import CollectionDetailsContainer from '../components/source/collection/CollectionDetailsContainer';
import Introduction from '../components/source/Introduction';
import PageWrapper from '../components/source/PageWrapper';
import requireAuth from './routes.js';
import userRoutes from './userRoutes';
import SourcesApp from '../components/source/SourcesApp';

const sourceRoutes = (
  <Route path="/" component={SourcesApp}>

    {userRoutes}

    <Route component={PageWrapper} onEnter={requireAuth} >
      <Route path="/home" component={Introduction} onEnter={requireAuth} />
      <Route path="/source" >
        <Route path=":sourceId/details" component={SourceDetailsContainer} onEnter={requireAuth} />
      </Route>
      <Route path="/collection" >
        <Route path=":collectionId/details" component={CollectionDetailsContainer} onEnter={requireAuth} />
      </Route>
    </Route>

  </Route>
);

export default sourceRoutes;
