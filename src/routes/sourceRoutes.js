import React from 'react';
import Route from 'react-router/lib/Route';
import Redirect from 'react-router/lib/Redirect';
import IndexRedirect from 'react-router/lib/IndexRedirect';
import SourceDetailsContainer from '../components/source/mediaSource/SourceDetailsContainer';
import CollectionDetailsContainer from '../components/source/collection/CollectionDetailsContainer';
import CreateCollectionContainer from '../components/source/collection/CreateCollectionContainer';
import EditCollectionContainer from '../components/source/collection/EditCollectionContainer';
import CreateSourceContainer from '../components/source/mediaSource/CreateSourceContainer';
import EditSourceContainer from '../components/source/mediaSource/EditSourceContainer';
import Introduction from '../components/source/Introduction';
import AllCollectionsContainer from '../components/source/collection/AllCollectionsContainer';
import PageWrapper from '../components/source/PageWrapper';
import { requireAuth } from './routes';
import userRoutes from './userRoutes';
import SourcesApp from '../components/source/SourcesApp';
import About from '../components/source/About';
import SearchContainer from '../components/source/search/SearchContainer';

const sourceRoutes = (
  <Route path="/" component={SourcesApp}>

    <IndexRedirect to="/home" />

    {userRoutes}

    <Route component={PageWrapper} onEnter={requireAuth} >
      <Route path="/about" component={About} />
      <Route path="/home" component={Introduction} onEnter={requireAuth} />
      <Route path="/search" component={SearchContainer} onEnter={requireAuth} />
      <Route path="/sources" >
        <Route path="create" component={CreateSourceContainer} onEnter={requireAuth} />
        <Route path=":sourceId" component={SourceDetailsContainer} onEnter={requireAuth} />
        <Redirect from=":sourceId/details" to=":sourceId" />
        <Route path=":sourceId/edit" component={EditSourceContainer} onEnter={requireAuth} />
      </Route>
      <Route path="/collections" >
        <Route path="all" component={AllCollectionsContainer} encodeURI={requireAuth} />
        <Route path="create" component={CreateCollectionContainer} onEnter={requireAuth} />
        <Route path=":collectionId" component={CollectionDetailsContainer} onEnter={requireAuth} />
        <Redirect from=":collectionId/details" to=":collectionId" />
        <Route path=":collectionId/edit" component={EditCollectionContainer} onEnter={requireAuth} />
      </Route>
      <Route path="/media-tag" >
        <Redirect from=":collectionId/details" to="/collections/:collectionId" />
      </Route>
    </Route>

  </Route>
);

export default sourceRoutes;
