import React from 'react';
import Route from 'react-router/lib/Route';
import Redirect from 'react-router/lib/Redirect';
import IndexRedirect from 'react-router/lib/IndexRedirect';
import SourceDetailsContainer from '../components/source/mediaSource/SourceDetailsContainer';
import CollectionDetailsContainer from '../components/source/collection/CollectionDetailsContainer';
import CreateCollectionContainer from '../components/source/collection/CreateCollectionContainer';
import AdvancedSearchContainer from '../components/source/collection/AdvancedSearchContainer';
import EditCollectionContainer from '../components/source/collection/EditCollectionContainer';
import CreateSourceContainer from '../components/source/mediaSource/CreateSourceContainer';
import EditSourceContainer from '../components/source/mediaSource/EditSourceContainer';
import SourceFeedContainer from '../components/source/mediaSource/SourceFeedContainer';
import Introduction from '../components/source/Introduction';
import MCCollectionListContainer from '../components/source/collection/list/MCCollectionListContainer';
import GVCollectionListContainer from '../components/source/collection/list/GVCollectionListContainer';
import EMMCollectionListContainer from '../components/source/collection/list/EMMCollectionListContainer';
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

    <Route component={PageWrapper}>
      <Route path="/about" component={About} />
      <Route path="/home" component={Introduction} />
      <Route path="/search" component={SearchContainer} onEnter={requireAuth} />
      <Route path="/sources" >
        <Route path="create" component={CreateSourceContainer} onEnter={requireAuth} />
        <Route path=":sourceId" component={SourceDetailsContainer} onEnter={requireAuth} />
        <Redirect from=":sourceId/details" to=":sourceId" />
        <Route path=":sourceId/feeds" component={SourceFeedContainer} onEnter={requireAuth} />
        <Route path=":sourceId/edit" component={EditSourceContainer} onEnter={requireAuth} />
      </Route>
      <Route path="/collections" >
        <Route path="media-cloud" component={MCCollectionListContainer} encodeURI={requireAuth} />
        <Route path="global-voices" component={GVCollectionListContainer} encodeURI={requireAuth} />
        <Route path="european-media-monitor" component={EMMCollectionListContainer} encodeURI={requireAuth} />
        <Route path="create" component={CreateCollectionContainer} onEnter={requireAuth} />
        <Route path="create/advancedSearch" component={AdvancedSearchContainer} onEnter={requireAuth} />
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
