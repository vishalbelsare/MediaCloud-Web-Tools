import React from 'react';
import Route from 'react-router/lib/Route';
import AboutContainer from '../components/common/AboutContainer';
import RecentNewsContainer from '../components/common/news/RecentNewsContainer';
import PageNotFound from '../components/PageNotFound';

const systemRoutes = (
  <Route path="/" >

    <Route path="/about" component={AboutContainer} />

    <Route path="/recent-news" component={RecentNewsContainer} />

    <Route path="*" component={PageNotFound} />

  </Route>
);

export default systemRoutes;
