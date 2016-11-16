import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRedirect from 'react-router/lib/IndexRedirect';
import SourceDetailsContainer from '../components/source/mediaSource/SourceDetailsContainer';
import CollectionDetailsContainer from '../components/source/collection/CollectionDetailsContainer';
import CreateCollectionContainer from '../components/source/collection/create/CreateCollectionContainer';
import Introduction from '../components/source/Introduction';
import PageWrapper from '../components/source/PageWrapper';
import { requireAuth } from './routes';
import userRoutes from './userRoutes';
import SourcesApp from '../components/source/SourcesApp';

const sourceRoutes = (
  <Route path="/" component={SourcesApp}>

    <IndexRedirect to="/home" />

    {userRoutes}

    <Route component={PageWrapper} onEnter={requireAuth} >
      <Route path="/home" component={Introduction} onEnter={requireAuth} />
      <Route path="/sources" >
        <Route path=":sourceId/details" component={SourceDetailsContainer} onEnter={requireAuth} />
      </Route>
      <Route path="/collections" >
        <Route path=":collectionId/details" component={CollectionDetailsContainer} onEnter={requireAuth} />
        <Route path=":createCollection" component={CreateCollectionContainer} onEnter={requireAuth} />
      </Route>
    </Route>

  </Route>
);

export default sourceRoutes;
