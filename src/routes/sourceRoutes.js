import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRedirect from 'react-router/lib/IndexRedirect';
import SourceDetailsContainer from '../components/source/mediaSource/SourceDetailsContainer';
import CollectionDetailsContainer from '../components/source/collection/CollectionDetailsContainer';
import CreateCollectionContainer from '../components/source/collection/create/CreateCollectionContainer';
import CreateSourceContainer from '../components/source/mediaSource/create/CreateSourceContainer';
import Introduction from '../components/source/Introduction';
import PageWrapper from '../components/source/PageWrapper';
import { requireAuth } from './routes';
import userRoutes from './userRoutes';
import SourcesApp from '../components/source/SourcesApp';
import About from '../components/source/About';
import SearchContainer from '../components/source/search/SearchContainer';
import CreateSourceContainer from '../components/source/mediaSource/create/CreateSourceContainer';

const sourceRoutes = (
  <Route path="/" component={SourcesApp}>

    <IndexRedirect to="/home" />

    {userRoutes}

    <Route component={PageWrapper} onEnter={requireAuth} >
      <Route path="/about" component={About} />
      <Route path="/home" component={Introduction} onEnter={requireAuth} />
      <Route path="/search" component={SearchContainer} onEnter={requireAuth} />
      <Route path="/sources" >
        <Route path=":sourceId/details" component={SourceDetailsContainer} onEnter={requireAuth} />
<<<<<<< Updated upstream
        <Route path="create" component={CreateSourceContainer} onEnter={requireAuth} />
=======
        <Route path=":createSource" component={CreateSourceContainer} onEnter={requireAuth} />
>>>>>>> Stashed changes
      </Route>
      <Route path="/collections" >
        <Route path=":collectionId/details" component={CollectionDetailsContainer} onEnter={requireAuth} />
        <Route path="create" component={CreateCollectionContainer} onEnter={requireAuth} />
      </Route>
    </Route>

  </Route>
);

export default sourceRoutes;
